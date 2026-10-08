<?php

namespace App\Http\Controllers\Api\v1;

use App\Enums\ReviewResult;
use App\Enums\ReviewType;
use App\Http\Controllers\Controller;
use App\Http\Requests\ReviewLogRequest;
use App\Models\Task;
use App\Services\TaskStateMachineService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function __construct(
        protected TaskStateMachineService $stateMachine
    ) {}

    /**
     * Submit manual code review or QA test log (FTR-K04-05).
     * If REJECTED, automatically triggers rework path back to DEVELOPMENT.
     */
    public function submitReview(ReviewLogRequest $request, string $taskId): JsonResponse
    {
        $authUser = $request->attributes->get('auth_user');
        $task = Task::findOrFail($taskId);

        $reviewType = ReviewType::from($request->input('review_type'));
        $result = ReviewResult::from($request->input('result'));

        $log = $this->stateMachine->processReview(
            $task,
            $reviewType,
            $result,
            $authUser['id'] ?? 'user-id',
            $authUser['name'] ?? 'Reviewer',
            $request->input('notes')
        );

        $freshTask = $task->fresh(['reviewLogs']);

        return response()->json([
            'status' => 'success',
            'message' => $result === ReviewResult::REJECTED
                ? "Pemeriksaan {$reviewType->value} ditolak. Tugas otomatis dikembalikan ke DEVELOPMENT (Alur Rework)."
                : "Pemeriksaan {$reviewType->value} berhasil lolos (PASSED).",
            'data' => [
                'log' => $log,
                'task' => $freshTask,
            ],
        ]);
    }

    /**
     * Project Manager checklist verification (FTR-K04-06).
     */
    public function pmVerify(Request $request, string $taskId): JsonResponse
    {
        $authUser = $request->attributes->get('auth_user');

        if (($authUser['role'] ?? '') !== 'PROJECT_MANAGER') {
            return response()->json([
                'status' => 'error',
                'message' => 'Akses ditolak. Hanya peran Project Manager yang berwenang mengisi verifikasi ceklis penyelesaian.',
            ], 403);
        }

        $task = Task::findOrFail($taskId);

        $updatedTask = $this->stateMachine->verifyPm(
            $task,
            $authUser['id'] ?? 'pm-id',
            $authUser['name'] ?? 'Project Manager'
        );

        return response()->json([
            'status' => 'success',
            'message' => 'Ceklis verifikasi kelayakan PM berhasil divalidasi. Tombol otorisasi TL kini aktif.',
            'data' => $updatedTask,
        ]);
    }

    /**
     * Technical Lead final sign-off authorization (FTR-K04-06).
     * Requires is_pm_verified = true before moving to DONE.
     */
    public function tlSignoff(Request $request, string $taskId): JsonResponse
    {
        $authUser = $request->attributes->get('auth_user');

        if (($authUser['role'] ?? '') !== 'TECHNICAL_LEAD') {
            return response()->json([
                'status' => 'error',
                'message' => 'Hanya peran Technical Lead yang berwenang melakukan final sign-off penutupan tugas.',
            ], 403);
        }

        $task = Task::findOrFail($taskId);

        $updatedTask = $this->stateMachine->signOffTl(
            $task,
            $authUser['id'] ?? 'tl-id',
            $authUser['name'] ?? 'Technical Lead'
        );

        return response()->json([
            'status' => 'success',
            'message' => 'Otorisasi sign-off penutupan tugas oleh Technical Lead berhasil. Tugas resmi berstatus DONE.',
            'data' => $updatedTask,
        ]);
    }
}
