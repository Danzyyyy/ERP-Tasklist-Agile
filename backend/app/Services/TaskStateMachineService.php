<?php

namespace App\Services;

use App\Enums\ApprovalStatus;
use App\Enums\ReviewResult;
use App\Enums\ReviewType;
use App\Enums\TaskStatus;
use App\Enums\UserRole;
use App\Models\Task;
use App\Models\TaskApproval;
use App\Models\TaskReviewLog;
use Illuminate\Validation\ValidationException;

class TaskStateMachineService
{
    /**
     * Initialize dual-approval records for newly created task.
     */
    public function initiateApprovals(Task $task): void
    {
        TaskApproval::updateOrCreate(
            ['task_id' => $task->id, 'role' => UserRole::TECHNICAL_LEAD->value],
            ['status' => ApprovalStatus::PENDING]
        );

        TaskApproval::updateOrCreate(
            ['task_id' => $task->id, 'role' => UserRole::PROJECT_MANAGER->value],
            ['status' => ApprovalStatus::PENDING]
        );
    }

    /**
     * Process an approval action from either Technical Lead or Project Manager.
     */
    public function processApproval(
        Task $task,
        string $role,
        string $actionStatus,
        ?string $approverId,
        ?string $approverName,
        ?string $notes = null
    ): TaskApproval {
        if (!in_array($role, [UserRole::TECHNICAL_LEAD->value, UserRole::PROJECT_MANAGER->value])) {
            throw ValidationException::withMessages([
                'role' => ['Hanya peran Technical Lead dan Project Manager yang berwenang memberikan persetujuan rilis.']
            ]);
        }

        $approval = TaskApproval::where('task_id', $task->id)
            ->where('role', $role)
            ->firstOrFail();

        $statusEnum = ApprovalStatus::from($actionStatus);

        $approval->update([
            'status' => $statusEnum,
            'approver_id' => $approverId,
            'approver_name' => $approverName,
            'notes' => $notes,
            'actioned_at' => now(),
        ]);

        if ($statusEnum === ApprovalStatus::REJECTED) {
            $task->update(['status' => TaskStatus::DRAFT]);
            return $approval->fresh();
        }

        // Check if both TL and PM have APPROVED
        $allApprovals = TaskApproval::where('task_id', $task->id)->get();
        $isTlApproved = $allApprovals->firstWhere('role', UserRole::TECHNICAL_LEAD->value)?->status === ApprovalStatus::APPROVED;
        $isPmApproved = $allApprovals->firstWhere('role', UserRole::PROJECT_MANAGER->value)?->status === ApprovalStatus::APPROVED;

        if ($isTlApproved && $isPmApproved) {
            $task->update(['status' => TaskStatus::RELEASED]);
        }

        return $approval->fresh();
    }

    /**
     * Transition task through the 5-column Kanban lifecycle.
     */
    public function transitionStatus(
        Task $task,
        TaskStatus $targetStatus,
        ?string $assigneeId = null,
        ?string $assigneeName = null
    ): Task {
        // Enforce rule: To move to DEVELOPMENT, assignee is required (FTR-K04-04)
        if ($targetStatus === TaskStatus::DEVELOPMENT) {
            if (empty($assigneeId) && empty($task->assignee_id)) {
                throw ValidationException::withMessages([
                    'assignee' => ['Tentukan pelaksana (assignee) sebelum memulai development.']
                ]);
            }

            if ($assigneeId) {
                $task->assignee_id = $assigneeId;
                $task->assignee_name = $assigneeName ?? $task->assignee_name;
            }
        }

        // Enforce rule: To move to DONE, dual verification & sign-off is required
        if ($targetStatus === TaskStatus::DONE) {
            if (!$task->is_pm_verified) {
                throw ValidationException::withMessages([
                    'verification' => ['Verifikasi ceklis PM wajib dipenuhi sebelum tugas dapat berstatus Done.']
                ]);
            }
            if (!$task->is_tl_signed) {
                throw ValidationException::withMessages([
                    'signoff' => ['Otorisasi sign-off khusus Technical Lead wajib dipenuhi sebelum tugas dapat berstatus Done.']
                ]);
            }
        }

        $task->status = $targetStatus;
        $task->save();

        return $task->fresh();
    }

    /**
     * Record a manual review/testing log and execute rework transition if rejected.
     */
    public function processReview(
        Task $task,
        ReviewType $reviewType,
        ReviewResult $result,
        string $reviewerId,
        string $reviewerName,
        ?string $notes = null
    ): TaskReviewLog {
        $log = TaskReviewLog::create([
            'task_id' => $task->id,
            'review_type' => $reviewType,
            'result' => $result,
            'reviewer_id' => $reviewerId,
            'reviewer_name' => $reviewerName,
            'notes' => $notes ?? '',
        ]);

        if ($result === ReviewResult::REJECTED) {
            // Jalur Rework: Otomatis kembali ke DEVELOPMENT
            $task->update([
                'status' => TaskStatus::DEVELOPMENT,
            ]);
        } else {
            // Passed: If Code Review passed, advance to TESTING
            if ($reviewType === ReviewType::CODE_REVIEW && $task->status === TaskStatus::CODE_REVIEW) {
                $task->update([
                    'status' => TaskStatus::TESTING,
                ]);
            }
        }

        return $log;
    }

    /**
     * PM Checklist Verification.
     */
    public function verifyPm(Task $task, string $pmId, string $pmName): Task
    {
        $task->update([
            'is_pm_verified' => true,
            'pm_verified_at' => now(),
            'pm_verified_by' => $pmName,
        ]);

        return $task->fresh();
    }

    /**
     * TL Sign-off authorization.
     */
    public function signOffTl(Task $task, string $tlId, string $tlName): Task
    {
        if (!$task->is_pm_verified) {
            throw ValidationException::withMessages([
                'verification' => ['Verifikasi ceklis PM wajib dipenuhi sebelum TL dapat mengesahkan tugas menjadi Done.']
            ]);
        }

        $task->update([
            'is_tl_signed' => true,
            'tl_signed_at' => now(),
            'tl_signed_by' => $tlName,
            'status' => TaskStatus::DONE,
        ]);

        return $task->fresh();
    }
}
