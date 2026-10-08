<?php

namespace Tests\Feature;

use App\Enums\ApprovalStatus;
use App\Enums\ComplexityWeight;
use App\Enums\ReviewResult;
use App\Enums\ReviewType;
use App\Enums\TaskStatus;
use App\Enums\UserRole;
use App\Models\Module;
use App\Models\Task;
use App\Models\TaskApproval;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TaskAgileExecutionTest extends TestCase
{
    use RefreshDatabase;

    protected Module $module;

    protected function setUp(): void
    {
        parent::setUp();

        $this->module = Module::create([
            'project_id' => 'PROJ-ERP-01',
            'code' => 'MOD-E4',
            'name' => 'Tasklist dan Eksekusi Agile',
        ]);
    }

    /**
     * Test 1: Task Creation initializes DRAFT and dual-approvals (TL and PM).
     */
    public function test_task_creation_initializes_draft_and_dual_approvals(): void
    {
        $response = $this->withHeaders([
            'Authorization' => 'Bearer mock_tl',
        ])->postJson('/api/v1/tasks', [
            'module_id' => $this->module->id,
            'task_code' => 'TSK-TEST-01',
            'title' => 'Buat arsitektur backend',
            'complexity_weight' => 'HIGH',
            'estimated_man_hours' => 10.0,
            'target_deadline' => now()->addDays(2)->toIso8601String(),
        ]);

        $response->assertStatus(201);
        $taskId = $response->json('data.id');

        $this->assertDatabaseHas('tasks', [
            'id' => $taskId,
            'status' => 'DRAFT',
        ]);

        $this->assertDatabaseHas('task_approvals', [
            'task_id' => $taskId,
            'role' => 'TECHNICAL_LEAD',
            'status' => 'PENDING',
        ]);

        $this->assertDatabaseHas('task_approvals', [
            'task_id' => $taskId,
            'role' => 'PROJECT_MANAGER',
            'status' => 'PENDING',
        ]);
    }

    /**
     * Test 2: Dual-Approval Release Gate (Requires both TL and PM to become RELEASED).
     */
    public function test_dual_approval_flow_releases_task(): void
    {
        $task = Task::create([
            'module_id' => $this->module->id,
            'task_code' => 'TSK-TEST-02',
            'title' => 'Tugas Dual Approval',
            'complexity_weight' => ComplexityWeight::MEDIUM,
            'estimated_man_hours' => 8.0,
            'target_deadline' => now()->addDays(2),
            'status' => TaskStatus::DRAFT,
        ]);
        TaskApproval::create(['task_id' => $task->id, 'role' => UserRole::TECHNICAL_LEAD->value, 'status' => ApprovalStatus::PENDING]);
        TaskApproval::create(['task_id' => $task->id, 'role' => UserRole::PROJECT_MANAGER->value, 'status' => ApprovalStatus::PENDING]);

        // Step 1: TL Approves
        $tlResponse = $this->withHeaders([
            'Authorization' => 'Bearer mock_tl',
        ])->postJson("/api/v1/tasks/{$task->id}/approvals", [
            'status' => 'APPROVED',
            'notes' => 'Disetujui dari sisi teknis.',
        ]);
        $tlResponse->assertStatus(200);

        // Status should still be DRAFT
        $this->assertEquals(TaskStatus::DRAFT, $task->fresh()->status);

        // Step 2: PM Approves
        $pmResponse = $this->withHeaders([
            'Authorization' => 'Bearer mock_pm',
        ])->postJson("/api/v1/tasks/{$task->id}/approvals", [
            'status' => 'APPROVED',
            'notes' => 'Disetujui dari sisi alokasi waktu dan anggaran.',
        ]);
        $pmResponse->assertStatus(200);

        // Status should now be RELEASED
        $this->assertEquals(TaskStatus::RELEASED, $task->fresh()->status);
    }

    /**
     * Test 3: Rework loop - When Code Review is REJECTED, status auto-reverts to DEVELOPMENT.
     */
    public function test_rework_loop_on_review_rejection(): void
    {
        $task = Task::create([
            'module_id' => $this->module->id,
            'task_code' => 'TSK-TEST-03',
            'title' => 'Tugas Uji Rework',
            'complexity_weight' => ComplexityWeight::LOW,
            'estimated_man_hours' => 4.0,
            'target_deadline' => now()->addDays(2),
            'status' => TaskStatus::CODE_REVIEW,
            'assignee_id' => '01926df4-0003-7000-8000-000000000003',
            'assignee_name' => 'Ariel',
        ]);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer mock_tl',
        ])->postJson("/api/v1/tasks/{$task->id}/reviews", [
            'review_type' => 'CODE_REVIEW',
            'result' => 'REJECTED',
            'notes' => 'Ada vulnerability pada validasi input.',
        ]);

        $response->assertStatus(200);

        // Task must automatically revert to DEVELOPMENT
        $this->assertEquals(TaskStatus::DEVELOPMENT, $task->fresh()->status);
    }

    /**
     * Test 4: Final Sign-off gate (PM verification checklist required before TL sign-off to DONE).
     */
    public function test_pm_verification_and_tl_signoff_gate(): void
    {
        $task = Task::create([
            'module_id' => $this->module->id,
            'task_code' => 'TSK-TEST-04',
            'title' => 'Tugas Verifikasi Selesai',
            'complexity_weight' => ComplexityWeight::MEDIUM,
            'estimated_man_hours' => 5.0,
            'target_deadline' => now()->addDays(2),
            'status' => TaskStatus::TESTING,
            'is_pm_verified' => false,
            'is_tl_signed' => false,
        ]);

        // Attempting TL signoff without PM verification must fail
        $tlFailResponse = $this->withHeaders([
            'Authorization' => 'Bearer mock_tl',
        ])->patchJson("/api/v1/tasks/{$task->id}/tl-signoff");
        $tlFailResponse->assertStatus(422);

        // Step 1: PM verifies checklist
        $pmResponse = $this->withHeaders([
            'Authorization' => 'Bearer mock_pm',
        ])->patchJson("/api/v1/tasks/{$task->id}/pm-verify");
        $pmResponse->assertStatus(200);
        $this->assertTrue($task->fresh()->is_pm_verified);

        // Step 2: TL signs off
        $tlSuccessResponse = $this->withHeaders([
            'Authorization' => 'Bearer mock_tl',
        ])->patchJson("/api/v1/tasks/{$task->id}/tl-signoff");
        $tlSuccessResponse->assertStatus(200);

        $fresh = $task->fresh();
        $this->assertTrue($fresh->is_tl_signed);
        $this->assertEquals(TaskStatus::DONE, $fresh->status);
    }

    /**
     * Test 5: Deliverable Progress calculation formula (Done Man-hours / Total Man-hours * 100).
     */
    public function test_deliverable_progress_calculation_formula(): void
    {
        // 10 hours DONE
        Task::create([
            'module_id' => $this->module->id,
            'task_code' => 'TSK-M1',
            'title' => 'Task Done',
            'complexity_weight' => ComplexityWeight::HIGH,
            'estimated_man_hours' => 10.0,
            'target_deadline' => now()->addDays(2),
            'status' => TaskStatus::DONE,
        ]);

        // 30 hours IN PROGRESS
        Task::create([
            'module_id' => $this->module->id,
            'task_code' => 'TSK-M2',
            'title' => 'Task Development',
            'complexity_weight' => ComplexityWeight::HIGH,
            'estimated_man_hours' => 30.0,
            'target_deadline' => now()->addDays(2),
            'status' => TaskStatus::DEVELOPMENT,
        ]);

        // Total = 40h, Done = 10h -> Progress = (10 / 40) * 100 = 25.00%
        $response = $this->withHeaders([
            'Authorization' => 'Bearer mock_tl',
        ])->getJson('/api/v1/projects/PROJ-ERP-01/deliverable-progress');

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'success',
                'data' => [
                    'totalTasks' => 2,
                    'completedTasks' => 1,
                    'totalEstimatedManHours' => 40.0,
                    'completedManHours' => 10.0,
                    'progressPercentage' => 25.0,
                ],
            ]);
    }
}
