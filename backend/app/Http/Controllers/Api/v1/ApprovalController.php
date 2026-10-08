<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Http\Requests\ApprovalRequest;
use App\Models\Task;
use App\Models\TaskApproval;
use App\Services\TaskStateMachineService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ApprovalController extends Controller
{
    public function __construct(
        protected TaskStateMachineService $stateMachine
    ) {}

    /**
     * List approvals for a specific task.
     */
    public function index(string $taskId): JsonResponse
    {
        $task = Task::findOrFail($taskId);
        $approvals = TaskApproval::where('task_id', $task->id)->get();

        return response()->json([
            'status' => 'success',
            'data' => [
                'task_id' => $task->id,
                'task_title' => $task->title,
                'task_status' => $task->status,
                'approvals' => $approvals,
            ],
        ]);
    }

    /**
     * Submit an approval or rejection for task release (Dual-Approval gate).
     * Accessible only to TECHNICAL_LEAD or PROJECT_MANAGER.
     */
    public function store(ApprovalRequest $request, string $taskId): JsonResponse
    {
        $authUser = $request->attributes->get('auth_user');
        $userRole = $authUser['role'] ?? null;

        if (!in_array($userRole, ['TECHNICAL_LEAD', 'PROJECT_MANAGER'])) {
            return response()->json([
                'status' => 'error',
                'message' => 'Akses ditolak. Hanya peran Technical Lead dan Project Manager yang berwenang memberikan persetujuan rilis.',
            ], 403);
        }

        $task = Task::findOrFail($taskId);

        $approval = $this->stateMachine->processApproval(
            $task,
            $userRole,
            $request->input('status'),
            $authUser['id'] ?? null,
            $authUser['name'] ?? null,
            $request->input('notes')
        );

        $freshTask = $task->fresh(['approvals']);

        return response()->json([
            'status' => 'success',
            'message' => "Persetujuan rilis peran {$userRole} berhasil dicatat dengan hasil {$request->input('status')}.",
            'data' => [
                'approval' => $approval,
                'task' => $freshTask,
            ],
        ]);
    }
}
