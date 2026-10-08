<?php

namespace App\Http\Controllers\Api\v1;

use App\Enums\TaskStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTaskRequest;
use App\Models\Module;
use App\Models\Task;
use App\Services\TaskStateMachineService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function __construct(
        protected TaskStateMachineService $stateMachine
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
     */
    public function store(StoreTaskRequest $request): JsonResponse
    {
        $authUser = $request->attributes->get('auth_user');

        $data = $request->validated();
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
     */
    public function updateStatus(Request $request, string $id): JsonResponse
    {
        $request->validate([
            'status' => ['required', 'string', 'in:RELEASED,DEVELOPMENT,CODE_REVIEW,TESTING,DONE'],
            'assignee_id' => ['nullable', 'string'],
            'assignee_name' => ['nullable', 'string'],
        ]);

        $task = Task::findOrFail($id);
        $targetStatus = TaskStatus::from($request->input('status'));

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
     */
    public function assign(Request $request, string $id): JsonResponse
    {
        $request->validate([
            'assignee_id' => ['required', 'string'],
            'assignee_name' => ['required', 'string'],
        ]);

        $task = Task::findOrFail($id);
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
