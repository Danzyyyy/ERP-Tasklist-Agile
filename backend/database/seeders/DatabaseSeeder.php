<?php

namespace Database\Seeders;

use App\Enums\ApprovalStatus;
use App\Enums\ComplexityWeight;
use App\Enums\ReviewResult;
use App\Enums\ReviewType;
use App\Enums\TaskStatus;
use App\Enums\UserRole;
use App\Models\Feature;
use App\Models\Module;
use App\Models\Task;
use App\Models\TaskApproval;
use App\Models\TaskReviewLog;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Module E-4
        $modE4 = Module::create([
            'project_id' => 'PROJ-ERP-01',
            'code' => 'MOD-E4',
            'name' => 'Tasklist dan Eksekusi Agile',
            'description' => 'Modul E-4: Pengelolaan hierarki tugas, papan kanban agile, dual approval rilis, dan pelacakan progres.',
        ]);

        // 2. Module E-5
        $modE5 = Module::create([
            'project_id' => 'PROJ-ERP-01',
            'code' => 'MOD-E5',
            'name' => 'Pelaporan Progres & Pengawasan',
            'description' => 'Modul E-5: Integrasi data progres deliverable untuk pelaporan manajemen dan dashboard eksekutif.',
        ]);

        // Features under MOD-E4
        $ftrHierarchy = Feature::create([
            'module_id' => $modE4->id,
            'code' => 'FTR-K04-01',
            'name' => 'Pengelolaan Hierarki Modul, Fitur, dan Tugas',
            'description' => 'Fondasi struktur data utama (Modul -> Fitur -> Tugas).',
        ]);

        $ftrDualApproval = Feature::create([
            'module_id' => $modE4->id,
            'code' => 'FTR-K04-03',
            'name' => 'Mekanisme Dual-Approval Persetujuan Rilis Tugas',
            'description' => 'Persetujuan rilis terpisah oleh Technical Lead dan Project Manager.',
        ]);

        $ftrKanban = Feature::create([
            'module_id' => $modE4->id,
            'code' => 'FTR-K04-04',
            'name' => 'Papan Tugas Interaktif / Agile Kanban Board',
            'description' => 'Visualisasi alur kerja 5 tahap: RELEASED, DEVELOPMENT, CODE_REVIEW, TESTING, DONE.',
        ]);

        $ftrRework = Feature::create([
            'module_id' => $modE4->id,
            'code' => 'FTR-K04-05',
            'name' => 'Pencatatan Manual Code Review & Alur Rework',
            'description' => 'Otomasi pengembalian kartu tugas gagal uji ke Development.',
        ]);

        $ftrSignoff = Feature::create([
            'module_id' => $modE4->id,
            'code' => 'FTR-K04-06',
            'name' => 'Verifikasi Ceklis PM & Otorisasi Pengesahan TL',
            'description' => 'Gerbang final verifikasi PM dan otorisasi sign-off TL untuk status DONE.',
        ]);

        // Task 1: DONE task (verified & signed off)
        $task1 = Task::create([
            'module_id' => $modE4->id,
            'feature_id' => $ftrHierarchy->id,
            'task_code' => 'TSK-001',
            'title' => 'Implementasi Skema Migrasi Database Relasional & UUID v7',
            'description' => 'Membuat skema database untuk Module, Feature, Task, Approval, dan ReviewLog menggunakan RFC 9562 UUID v7.',
            'complexity_weight' => ComplexityWeight::HIGH,
            'estimated_man_hours' => 12.00,
            'actual_man_hours' => 11.50,
            'target_deadline' => now()->addDays(2),
            'status' => TaskStatus::DONE,
            'is_pm_verified' => true,
            'pm_verified_at' => now()->subHours(4),
            'pm_verified_by' => 'Tubagus M. Wildan (PM)',
            'is_tl_signed' => true,
            'tl_signed_at' => now()->subHours(2),
            'tl_signed_by' => 'Fauzan (TL)',
            'assignee_id' => '01926df4-0003-7000-8000-000000000003',
            'assignee_name' => 'Ariel (Frontend Dev)',
            'created_by' => 'Fauzan (TL)',
        ]);

        TaskApproval::create([
            'task_id' => $task1->id,
            'role' => UserRole::TECHNICAL_LEAD->value,
            'status' => ApprovalStatus::APPROVED,
            'approver_id' => '01926df4-0001-7000-8000-000000000001',
            'approver_name' => 'Fauzan (TL)',
            'notes' => 'Spesifikasi UUID v7 dan foreign keys sudah sesuai standar.',
            'actioned_at' => now()->subDays(2),
        ]);
        TaskApproval::create([
            'task_id' => $task1->id,
            'role' => UserRole::PROJECT_MANAGER->value,
            'status' => ApprovalStatus::APPROVED,
            'approver_id' => '01926df4-0002-7000-8000-000000000002',
            'approver_name' => 'Tubagus M. Wildan (PM)',
            'notes' => 'Alokasi man-hour disetujui.',
            'actioned_at' => now()->subDays(2),
        ]);

        // Task 2: TESTING task (passed QA review, ready for PM verify)
        $task2 = Task::create([
            'module_id' => $modE4->id,
            'feature_id' => $ftrSignoff->id,
            'task_code' => 'TSK-002',
            'title' => 'Pengujian Validasi Form Ceklis Verifikasi PM',
            'description' => 'Memastikan tombol sign-off TL nonaktif sebelum PM mencentang kelayakan selesai.',
            'complexity_weight' => ComplexityWeight::MEDIUM,
            'estimated_man_hours' => 6.00,
            'actual_man_hours' => 5.00,
            'target_deadline' => now()->addDays(3),
            'status' => TaskStatus::TESTING,
            'is_pm_verified' => false,
            'is_tl_signed' => false,
            'assignee_id' => '01926df4-0004-7000-8000-000000000004',
            'assignee_name' => 'Valdric (QA Tester)',
            'created_by' => 'Tubagus M. Wildan (PM)',
        ]);

        TaskApproval::create([
            'task_id' => $task2->id,
            'role' => UserRole::TECHNICAL_LEAD->value,
            'status' => ApprovalStatus::APPROVED,
            'approver_name' => 'Fauzan (TL)',
            'actioned_at' => now()->subDays(1),
        ]);
        TaskApproval::create([
            'task_id' => $task2->id,
            'role' => UserRole::PROJECT_MANAGER->value,
            'status' => ApprovalStatus::APPROVED,
            'approver_name' => 'Tubagus M. Wildan (PM)',
            'actioned_at' => now()->subDays(1),
        ]);

        TaskReviewLog::create([
            'task_id' => $task2->id,
            'review_type' => ReviewType::CODE_REVIEW,
            'result' => ReviewResult::PASSED,
            'reviewer_id' => '01926df4-0001-7000-8000-000000000001',
            'reviewer_name' => 'Fauzan (TL)',
            'notes' => 'Code quality sesuai PSR-12 dan clean architecture.',
        ]);

        // Task 3: CODE_REVIEW task
        $task3 = Task::create([
            'module_id' => $modE4->id,
            'feature_id' => $ftrKanban->id,
            'task_code' => 'TSK-003',
            'title' => 'Komponen Visual Kanban 5 Kolom & State Handler Interaktif',
            'description' => 'Membangun kolom RELEASED, DEVELOPMENT, CODE_REVIEW, TESTING, dan DONE di React 18 SPA.',
            'complexity_weight' => ComplexityWeight::HIGH,
            'estimated_man_hours' => 10.00,
            'actual_man_hours' => 8.00,
            'target_deadline' => now()->addDays(4),
            'status' => TaskStatus::CODE_REVIEW,
            'is_pm_verified' => false,
            'is_tl_signed' => false,
            'assignee_id' => '01926df4-0003-7000-8000-000000000003',
            'assignee_name' => 'Ariel (Frontend Dev)',
            'created_by' => 'Fauzan (TL)',
        ]);

        TaskApproval::create([
            'task_id' => $task3->id,
            'role' => UserRole::TECHNICAL_LEAD->value,
            'status' => ApprovalStatus::APPROVED,
            'approver_name' => 'Fauzan (TL)',
            'actioned_at' => now()->subDays(1),
        ]);
        TaskApproval::create([
            'task_id' => $task3->id,
            'role' => UserRole::PROJECT_MANAGER->value,
            'status' => ApprovalStatus::APPROVED,
            'approver_name' => 'Tubagus M. Wildan (PM)',
            'actioned_at' => now()->subDays(1),
        ]);

        // Task 4: DEVELOPMENT task
        $task4 = Task::create([
            'module_id' => $modE4->id,
            'feature_id' => $ftrRework->id,
            'task_code' => 'TSK-004',
            'title' => 'Otomasi Jalur Rework ke Kolom Development saat Reject',
            'description' => 'Memastikan tugas yang ditolak di code review/testing langsung berbalik ke DEVELOPMENT dengan penanda Rework.',
            'complexity_weight' => ComplexityWeight::MEDIUM,
            'estimated_man_hours' => 8.00,
            'actual_man_hours' => 3.50,
            'target_deadline' => now()->addDays(3),
            'status' => TaskStatus::DEVELOPMENT,
            'assignee_id' => '01926df4-0003-7000-8000-000000000003',
            'assignee_name' => 'Ariel (Frontend Dev)',
            'created_by' => 'Tubagus M. Wildan (PM)',
        ]);

        TaskApproval::create([
            'task_id' => $task4->id,
            'role' => UserRole::TECHNICAL_LEAD->value,
            'status' => ApprovalStatus::APPROVED,
            'approver_name' => 'Fauzan (TL)',
            'actioned_at' => now()->subDays(1),
        ]);
        TaskApproval::create([
            'task_id' => $task4->id,
            'role' => UserRole::PROJECT_MANAGER->value,
            'status' => ApprovalStatus::APPROVED,
            'approver_name' => 'Tubagus M. Wildan (PM)',
            'actioned_at' => now()->subDays(1),
        ]);

        // Task 5: RELEASED task (waiting for developer to pick up)
        $task5 = Task::create([
            'module_id' => $modE4->id,
            'feature_id' => $ftrDualApproval->id,
            'task_code' => 'TSK-005',
            'title' => 'Audit Log Riwayat Catatan Revisi Dual-Approval',
            'description' => 'Menyimpan log catatan revisi ketika salah satu pihak menolak persetujuan rilis.',
            'complexity_weight' => ComplexityWeight::LOW,
            'estimated_man_hours' => 4.00,
            'actual_man_hours' => 0.00,
            'target_deadline' => now()->addDays(5),
            'status' => TaskStatus::RELEASED,
            'created_by' => 'Tubagus M. Wildan (PM)',
        ]);

        TaskApproval::create([
            'task_id' => $task5->id,
            'role' => UserRole::TECHNICAL_LEAD->value,
            'status' => ApprovalStatus::APPROVED,
            'approver_name' => 'Fauzan (TL)',
            'actioned_at' => now()->subHours(12),
        ]);
        TaskApproval::create([
            'task_id' => $task5->id,
            'role' => UserRole::PROJECT_MANAGER->value,
            'status' => ApprovalStatus::APPROVED,
            'approver_name' => 'Tubagus M. Wildan (PM)',
            'actioned_at' => now()->subHours(10),
        ]);

        // Task 6: DRAFT task (TL approved, PM still PENDING)
        $task6 = Task::create([
            'module_id' => $modE4->id,
            'feature_id' => $ftrDualApproval->id,
            'task_code' => 'TSK-006',
            'title' => 'Integrasi API Client Bearer Token F-1 Authentication',
            'description' => 'Koneksi REST API Axios interceptor dengan format Bearer token Modul F-1.',
            'complexity_weight' => ComplexityWeight::MEDIUM,
            'estimated_man_hours' => 6.00,
            'actual_man_hours' => 0.00,
            'target_deadline' => now()->addDays(1), // H-1 SLA alert
            'status' => TaskStatus::DRAFT,
            'created_by' => 'Fauzan (TL)',
        ]);

        TaskApproval::create([
            'task_id' => $task6->id,
            'role' => UserRole::TECHNICAL_LEAD->value,
            'status' => ApprovalStatus::APPROVED,
            'approver_id' => '01926df4-0001-7000-8000-000000000001',
            'approver_name' => 'Fauzan (TL)',
            'notes' => 'Secara arsitektur teknis siap dieksekusi.',
            'actioned_at' => now()->subHours(2),
        ]);
        TaskApproval::create([
            'task_id' => $task6->id,
            'role' => UserRole::PROJECT_MANAGER->value,
            'status' => ApprovalStatus::PENDING,
        ]);
    }
}
