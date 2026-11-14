<?php

namespace Tests\Feature;

use App\Enums\ComplexityWeight;
use App\Enums\TaskStatus;
use App\Models\Module;
use App\Models\Task;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TaskBugFixesTest extends TestCase
{
    use RefreshDatabase;

    protected Module $module;

    protected function setUp(): void
    {
        parent::setUp();

        $this->module = Module::create([
            'project_id' => 'PROJ-ERP-01',
            'code' => 'MOD-BUG-TEST',
            'name' => 'Module Pengujian Bug',
            'description' => 'Untuk verifikasi bug fixes QA',
        ]);
    }

    /**
     * Bug 1: Task yang sudah DONE bersifat terminal dan tidak bisa diubah ke fase lain (HTTP 422).
     */
    public function test_done_task_status_cannot_be_altered_422(): void
    {
        $task = Task::create([
            'module_id' => $this->module->id,
            'task_code' => 'TSK-DONE-01',
            'title' => 'Tugas yang sudah selesai',
            'complexity_weight' => ComplexityWeight::LOW,
            'estimated_man_hours' => 3.0,
            'target_deadline' => now()->addDays(2),
            'status' => TaskStatus::DONE,
            'is_pm_verified' => true,
            'is_tl_signed' => true,
        ]);

        // Coba ubah kembali ke DEVELOPMENT
        $response = $this->withHeader('Authorization', 'Bearer mock_tl')
            ->patchJson("/api/v1/tasks/{$task->id}/status", [
                'status' => 'DEVELOPMENT',
            ]);

        $response->assertStatus(422)
            ->assertJsonPath('status', 'error')
            ->assertJsonPath('message', 'Tugas yang telah berstatus DONE bersifat final dan tidak dapat diubah kembali ke fase lain.');
    }

    /**
     * Bug 1: Task yang sudah DONE tidak bisa ditinjau atau direview ulang (HTTP 422).
     */
    public function test_done_task_cannot_be_reviewed_or_reworked_422(): void
    {
        $task = Task::create([
            'module_id' => $this->module->id,
            'task_code' => 'TSK-DONE-02',
            'title' => 'Tugas selesai ditolak review',
            'complexity_weight' => ComplexityWeight::LOW,
            'estimated_man_hours' => 2.0,
            'target_deadline' => now()->addDays(1),
            'status' => TaskStatus::DONE,
            'is_pm_verified' => true,
            'is_tl_signed' => true,
        ]);

        $response = $this->withHeader('Authorization', 'Bearer mock_tl')
            ->postJson("/api/v1/tasks/{$task->id}/reviews", [
                'review_type' => 'CODE_REVIEW',
                'result' => 'REJECTED',
                'notes' => 'Mencoba reject tugas yang sudah DONE',
            ]);

        $response->assertStatus(422)
            ->assertJsonPath('status', 'error');
    }

    /**
     * Bug 1: Task yang sudah DONE tidak bisa diubah pelaksananya/PIC (HTTP 422).
     */
    public function test_done_task_cannot_be_reassigned_422(): void
    {
        $task = Task::create([
            'module_id' => $this->module->id,
            'task_code' => 'TSK-DONE-03',
            'title' => 'Tugas selesai diubah PIC',
            'complexity_weight' => ComplexityWeight::LOW,
            'estimated_man_hours' => 2.0,
            'target_deadline' => now()->addDays(1),
            'status' => TaskStatus::DONE,
            'assignee_id' => '01926df4-0003-7000-8000-000000000003',
            'assignee_name' => 'Ariel',
        ]);

        $response = $this->withHeader('Authorization', 'Bearer mock_tl')
            ->patchJson("/api/v1/tasks/{$task->id}/assign", [
                'assignee_id' => '01926df4-0005-7000-8000-000000000005',
                'assignee_name' => 'Muhamad Fajri',
            ]);

        $response->assertStatus(422)
            ->assertJsonPath('status', 'error')
            ->assertJsonPath('message', 'Tugas yang telah berstatus DONE tidak dapat diubah pelaksananya (PIC).');
    }

    /**
     * Bug 2: Developer tidak boleh mengubah status tugas yang sedang di CODE_REVIEW atau TESTING (HTTP 403).
     */
    public function test_developer_cannot_alter_task_in_code_review_or_testing_403(): void
    {
        $taskInReview = Task::create([
            'module_id' => $this->module->id,
            'task_code' => 'TSK-REV-01',
            'title' => 'Tugas dalam Code Review',
            'complexity_weight' => ComplexityWeight::MEDIUM,
            'estimated_man_hours' => 5.0,
            'target_deadline' => now()->addDays(2),
            'status' => TaskStatus::CODE_REVIEW,
            'assignee_id' => '01926df4-0003-7000-8000-000000000003',
            'assignee_name' => 'Ariel',
        ]);

        // Developer mencoba memindahkan kembali ke DEVELOPMENT
        $response = $this->withHeader('Authorization', 'Bearer mock_dev')
            ->patchJson("/api/v1/tasks/{$taskInReview->id}/status", [
                'status' => 'DEVELOPMENT',
            ]);

        $response->assertStatus(403)
            ->assertJsonPath('status', 'error');
    }

    /**
     * Bug 2: Developer tidak boleh memindahkan tugas langsung ke DONE (HTTP 403).
     */
    public function test_developer_cannot_submit_task_directly_to_done_403(): void
    {
        $task = Task::create([
            'module_id' => $this->module->id,
            'task_code' => 'TSK-DEV-01',
            'title' => 'Tugas dalam Development',
            'complexity_weight' => ComplexityWeight::MEDIUM,
            'estimated_man_hours' => 4.0,
            'target_deadline' => now()->addDays(2),
            'status' => TaskStatus::DEVELOPMENT,
            'assignee_id' => '01926df4-0003-7000-8000-000000000003',
            'assignee_name' => 'Ariel',
        ]);

        $response = $this->withHeader('Authorization', 'Bearer mock_dev')
            ->patchJson("/api/v1/tasks/{$task->id}/status", [
                'status' => 'DONE',
            ]);

        $response->assertStatus(403)
            ->assertJsonPath('status', 'error');
    }

    /**
     * Bug 2: Developer tidak boleh submit hasil review / reject (HTTP 403).
     */
    public function test_developer_cannot_submit_review_or_reject_testing_403(): void
    {
        $task = Task::create([
            'module_id' => $this->module->id,
            'task_code' => 'TSK-TEST-REV',
            'title' => 'Tugas dalam Testing',
            'complexity_weight' => ComplexityWeight::HIGH,
            'estimated_man_hours' => 8.0,
            'target_deadline' => now()->addDays(3),
            'status' => TaskStatus::TESTING,
            'assignee_id' => '01926df4-0003-7000-8000-000000000003',
            'assignee_name' => 'Ariel',
        ]);

        // Developer mencoba menolak (reject) testing
        $response = $this->withHeader('Authorization', 'Bearer mock_dev')
            ->postJson("/api/v1/tasks/{$task->id}/reviews", [
                'review_type' => 'TESTING',
                'result' => 'REJECTED',
                'notes' => 'Developer mencoba menolak pengujian sendiri',
            ]);

        $response->assertStatus(403)
            ->assertJsonPath('status', 'error')
            ->assertJsonPath('message', 'Akses ditolak. Peran Developer tidak berwenang mencatat hasil pemeriksaan Code Review atau Testing.');
    }

    /**
     * Bug 3: Non-TL/PM (misal Developer atau Tester) tidak boleh membuat Module (HTTP 403).
     */
    public function test_non_tl_pm_cannot_create_module_403(): void
    {
        $response = $this->withHeader('Authorization', 'Bearer mock_dev')
            ->postJson('/api/v1/modules', [
                'project_id' => 'PROJ-ERP-01',
                'code' => 'MOD-DEV-ILLEGAL',
                'name' => 'Modul Ilegal',
            ]);

        $response->assertStatus(403)
            ->assertJsonPath('status', 'error');
    }

    /**
     * Bug 3: Non-TL/PM (misal Developer) tidak boleh membuat Task baru (HTTP 403).
     */
    public function test_non_tl_pm_cannot_create_task_403(): void
    {
        $response = $this->withHeader('Authorization', 'Bearer mock_dev')
            ->postJson('/api/v1/tasks', [
                'module_id' => $this->module->id,
                'task_code' => 'TSK-ILLEGAL',
                'title' => 'Tugas Dibuat Developer',
                'complexity_weight' => 'LOW',
                'estimated_man_hours' => 2.0,
                'target_deadline' => now()->addDays(1)->toIso8601String(),
            ]);

        $response->assertStatus(403)
            ->assertJsonPath('status', 'error')
            ->assertJsonPath('message', 'Akses ditolak. Hanya peran Technical Lead dan Project Manager yang berwenang membuat tugas baru.');
    }

    /**
     * Bug 3: Tugas berstatus DRAFT tidak boleh di-assign PIC sebelum dirilis (HTTP 422).
     */
    public function test_cannot_assign_pic_on_draft_task_422(): void
    {
        $task = Task::create([
            'module_id' => $this->module->id,
            'task_code' => 'TSK-DRAFT-01',
            'title' => 'Tugas Masih Draft',
            'complexity_weight' => ComplexityWeight::LOW,
            'estimated_man_hours' => 3.0,
            'target_deadline' => now()->addDays(2),
            'status' => TaskStatus::DRAFT,
        ]);

        $response = $this->withHeader('Authorization', 'Bearer mock_pm')
            ->patchJson("/api/v1/tasks/{$task->id}/assign", [
                'assignee_id' => '01926df4-0003-7000-8000-000000000003',
                'assignee_name' => 'Ariel',
            ]);

        $response->assertStatus(422)
            ->assertJsonPath('status', 'error')
            ->assertJsonPath('message', 'Tugas berstatus DRAFT belum dapat ditugaskan ke pengembang sebelum disetujui rilis (Dual-Approval) oleh TL dan PM.');
    }

    /**
     * Bug 3: Developer hanya boleh menugaskan dirinya sendiri, bukan menugaskan developer lain (HTTP 403).
     */
    public function test_developer_cannot_assign_other_developer_403(): void
    {
        $task = Task::create([
            'module_id' => $this->module->id,
            'task_code' => 'TSK-REL-01',
            'title' => 'Tugas Released',
            'complexity_weight' => ComplexityWeight::MEDIUM,
            'estimated_man_hours' => 4.0,
            'target_deadline' => now()->addDays(2),
            'status' => TaskStatus::RELEASED,
        ]);

        // Developer Ariel (id: ...0003) mencoba menugaskan Fajri (id: ...0005)
        $response = $this->withHeader('Authorization', 'Bearer mock_dev')
            ->patchJson("/api/v1/tasks/{$task->id}/assign", [
                'assignee_id' => '01926df4-0005-7000-8000-000000000005',
                'assignee_name' => 'Muhamad Fajri',
            ]);

        $response->assertStatus(403)
            ->assertJsonPath('status', 'error')
            ->assertJsonPath('message', 'Pengembang hanya berwenang menugaskan diri sendiri ke tugas.');
    }
}
