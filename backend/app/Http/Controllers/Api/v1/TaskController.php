<?php

namespace App\Http\Controllers\Api\v1;

use App\Enums\TaskStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTaskRequest;
use App\Models\Module;
use App\Models\Task;
use App\Services\ExternalIntegrationService;
use App\Services\TaskStateMachineService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function __construct(
        protected TaskStateMachineService $stateMachine,
        protected ExternalIntegrationService $integrationService
    ) {}

    /**
     * Get tasks with optional filters.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Task::with(['module', 'feature', 'approvals', 'reviewLogs']);

        if ($request->filled('module_id')) {
            $query->where('module_id', $request->input('module_id'));
        }

        if ($request->filled('feature_id')) {
            $query->where('feature_id', $request->input('feature_id'));
        }

        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        $tasks = $query->orderBy('created_at', 'desc')->get();

        return response()->json([
            'status' => 'success',
            'data' => $tasks,
        ]);
    }

    /**
     * Get hierarchical structure: Modules -> Features (nullable) -> Tasks.
     */
    public function hierarchy(Request $request): JsonResponse
    {
        $projectId = $request->input('project_id', 'PROJ-ERP-01');

        $modules = Module::with([
            'features.tasks.approvals',
            'tasks' => function ($query) {
                // Tasks directly under module without feature
                $query->whereNull('feature_id')->with('approvals');
            }
        ])
        ->where('project_id', $projectId)
        ->get();

        return response()->json([
            'status' => 'success',
            'data' => $modules,
        ]);
    }

    /**
     * Store a new task in DRAFT status and initialize dual approvals.
     * Guarded: Role TL/PM only, and project must be REGISTERED in D-1.
     */
    public function store(StoreTaskRequest $request): JsonResponse
    {
        $authUser = $request->attributes->get('auth_user');
        $userRole = $authUser['role'] ?? null;

        // Role Guard: Only TL or PM can create new tasks
        if (!in_array($userRole, ['TECHNICAL_LEAD', 'PROJECT_MANAGER'])) {
            return response()->json([
                'status' => 'error',
                'message' => 'Akses ditolak. Hanya peran Technical Lead dan Project Manager yang berwenang membuat tugas baru.',
            ], 403);
        }

        $data = $request->validated();

        // Project Guard: Module's project must be REGISTERED in D-1
        $module = Module::findOrFail($data['module_id']);
        $guard = $this->integrationService->guardD1ProjectStatus($module->project_id, $request->bearerToken());
        if (!$guard['allowed']) {
            return response()->json([
                'status' => 'error',
                'code' => 'PROJECT_NOT_REGISTERED',
                'message' => $guard['message'],
            ], 422);
        }

        $data['status'] = TaskStatus::DRAFT;
        $data['created_by'] = $authUser['id'] ?? null;

        $task = Task::create($data);

        // Initiate Dual-Approval gatekeeping
        $this->stateMachine->initiateApprovals($task);

        return response()->json([
            'status' => 'success',
            'message' => 'Tugas berhasil dibuat dengan status DRAFT dan menunggu Dual-Approval.',
            'data' => $task->load(['approvals', 'module', 'feature']),
        ], 201);
    }

    /**
     * Get task details.
     */
    public function show(string $id): JsonResponse
    {
        $task = Task::with(['module', 'feature', 'approvals', 'reviewLogs', 'dependencies.prerequisiteTask'])->findOrFail($id);

        return response()->json([
            'status' => 'success',
            'data' => $task,
        ]);
    }

    /**
     * Update task status (Agile Kanban column move).
     * Guarded: Terminal DONE immutability, role-based transitions.
     */
    public function updateStatus(Request $request, string $id): JsonResponse
    {
        $request->validate([
            'status' => ['required', 'string', 'in:RELEASED,DEVELOPMENT,CODE_REVIEW,TESTING,DONE'],
            'assignee_id' => ['nullable', 'string'],
            'assignee_name' => ['nullable', 'string'],
        ]);

        $authUser = $request->attributes->get('auth_user');
        $userRole = $authUser['role'] ?? null;

        $task = Task::findOrFail($id);

        // Terminal state check: DONE tasks cannot be altered
        if ($task->status === TaskStatus::DONE) {
            return response()->json([
                'status' => 'error',
                'message' => 'Tugas yang telah berstatus DONE bersifat final dan tidak dapat diubah kembali ke fase lain.',
            ], 422);
        }

        $targetStatus = TaskStatus::from($request->input('status'));

        // Role Guard: Developer restrictions
        if ($userRole === 'DEVELOPER') {
            // Developer cannot transition to DONE directly
            if ($targetStatus === TaskStatus::DONE) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Hanya peran Technical Lead yang berwenang mengesahkan tugas menjadi DONE melalui otorisasi sign-off.',
                ], 403);
            }

            // Developer cannot touch tasks currently in CODE_REVIEW or TESTING
            if (in_array($task->status, [TaskStatus::CODE_REVIEW, TaskStatus::TESTING])) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Akses ditolak. Pengembang tidak berwenang mengubah status tugas yang sedang dalam tahap Code Review atau Testing.',
                ], 403);
            }

            // Developer can only move: RELEASED -> DEVELOPMENT or DEVELOPMENT -> CODE_REVIEW
            $allowedDevTransitions = [
                TaskStatus::RELEASED->value => [TaskStatus::DEVELOPMENT->value],
                TaskStatus::DEVELOPMENT->value => [TaskStatus::CODE_REVIEW->value],
            ];

            $currStatusVal = $task->status->value;
            if (!isset($allowedDevTransitions[$currStatusVal]) || !in_array($targetStatus->value, $allowedDevTransitions[$currStatusVal])) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Pengembang hanya berwenang menarik tugas dari RELEASED ke DEVELOPMENT atau mengajukan DEVELOPMENT ke CODE_REVIEW.',
                ], 403);
            }
        } elseif ($userRole === 'TESTER') {
            // Tester cannot manually drag tasks across Kanban columns
            return response()->json([
                'status' => 'error',
                'message' => 'Peran Tester tidak berwenang memindahkan kolom tugas secara manual. Gunakan endpoint review/testing.',
            ], 403);
        }

        $updatedTask = $this->stateMachine->transitionStatus(
            $task,
            $targetStatus,
            $request->input('assignee_id'),
            $request->input('assignee_name')
        );

        return response()->json([
            'status' => 'success',
            'message' => "Status tugas berhasil diperbarui ke {$targetStatus->value}.",
            'data' => $updatedTask->load(['approvals', 'reviewLogs']),
        ]);
    }

    /**
     * Assign PIC Developer to task.
     * Guarded: Role & task lifecycle status guards.
     */
    public function assign(Request $request, string $id): JsonResponse
    {
        $request->validate([
            'assignee_id' => ['required', 'string'],
            'assignee_name' => ['required', 'string'],
        ]);

        $authUser = $request->attributes->get('auth_user');
        $userRole = $authUser['role'] ?? null;

        $task = Task::findOrFail($id);

        // Status Guard: DRAFT tasks cannot have PIC assigned before release
        if ($task->status === TaskStatus::DRAFT) {
            return response()->json([
                'status' => 'error',
                'message' => 'Tugas berstatus DRAFT belum dapat ditugaskan ke pengembang sebelum disetujui rilis (Dual-Approval) oleh TL dan PM.',
            ], 422);
        }

        // Status Guard: DONE tasks cannot have PIC reassigned
        if ($task->status === TaskStatus::DONE) {
            return response()->json([
                'status' => 'error',
                'message' => 'Tugas yang telah berstatus DONE tidak dapat diubah pelaksananya (PIC).',
            ], 422);
        }

        // Role Guard: Developer can only assign themselves; TL & PM can assign anyone
        if ($userRole === 'DEVELOPER') {
            if ($request->input('assignee_id') !== ($authUser['id'] ?? '')) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Pengembang hanya berwenang menugaskan diri sendiri ke tugas.',
                ], 403);
            }
        } elseif (!in_array($userRole, ['TECHNICAL_LEAD', 'PROJECT_MANAGER'])) {
            return response()->json([
                'status' => 'error',
                'message' => 'Peran ini tidak berwenang menugaskan pengembang pada tugas.',
            ], 403);
        }

        $task->update([
            'assignee_id' => $request->input('assignee_id'),
            'assignee_name' => $request->input('assignee_name'),
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Pengembang berhasil ditugaskan.',
            'data' => $task,
        ]);
    }
}
