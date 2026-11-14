<?php

namespace App\Http\Controllers\Api\v1;

use App\Enums\ReviewResult;
use App\Enums\ReviewType;
use App\Enums\TaskStatus;
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
     * Guarded: Role checks (Developers cannot submit reviews) and terminal state immutability.
     */
    public function submitReview(ReviewLogRequest $request, string $taskId): JsonResponse
    {
        $authUser = $request->attributes->get('auth_user');
        $userRole = $authUser['role'] ?? null;
        $task = Task::findOrFail($taskId);

        // Terminal state check
        if ($task->status === TaskStatus::DONE) {
            return response()->json([
                'status' => 'error',
                'message' => 'Tugas yang telah berstatus DONE tidak dapat ditinjau atau diuji ulang.',
            ], 422);
        }

        $reviewType = ReviewType::from($request->input('review_type'));
        $result = ReviewResult::from($request->input('result'));

        // Role Guard: Developer cannot submit code review or testing
        if ($userRole === 'DEVELOPER') {
            return response()->json([
                'status' => 'error',
                'message' => 'Akses ditolak. Peran Developer tidak berwenang mencatat hasil pemeriksaan Code Review atau Testing.',
            ], 403);
        }

        // Role Guard for Code Review: TL or PM
        if ($reviewType === ReviewType::CODE_REVIEW && !in_array($userRole, ['TECHNICAL_LEAD', 'PROJECT_MANAGER'])) {
            return response()->json([
                'status' => 'error',
                'message' => 'Akses ditolak. Hanya peran Technical Lead dan Project Manager yang berwenang melakukan Code Review.',
            ], 403);
        }

        // Role Guard for Testing: Tester, TL, or PM
        if ($reviewType === ReviewType::TESTING && !in_array($userRole, ['TESTER', 'TECHNICAL_LEAD', 'PROJECT_MANAGER'])) {
            return response()->json([
                'status' => 'error',
                'message' => 'Akses ditolak. Hanya peran Tester, Technical Lead, dan Project Manager yang berwenang mencatat hasil pengujian QA.',
            ], 403);
        }

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

        if ($task->status === TaskStatus::DONE) {
            return response()->json([
                'status' => 'error',
                'message' => 'Tugas telah resmi berstatus DONE.',
            ], 422);
        }

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

        if ($task->status === TaskStatus::DONE) {
            return response()->json([
                'status' => 'error',
                'message' => 'Tugas telah resmi berstatus DONE.',
            ], 422);
        }

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
