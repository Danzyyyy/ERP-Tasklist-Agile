// src/Features/Tasks/Hooks/useSeedDemoData.ts
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import ModuleService from "@/Features/Modules/Services/ModuleService";
import TaskService from "../Services/TaskService";
import ApprovalService from "@/Features/Approvals/Services/ApprovalService";
import ReviewService from "@/Features/Reviews/Services/ReviewService";
import { sessionUtils } from "@/Utils/sessionUtils";
import { addDays, format } from "date-fns";

export const useSeedDemoData = () => {
  const queryClient = useQueryClient();
  const [seeding, setSeeding] = useState(false);

  const seed = async () => {
    setSeeding(true);
    const originalToken = sessionUtils.getToken();
    const originalRole = sessionUtils.getActiveRole();

    try {
      toast.info("Menginisialisasi struktur Modul & Fitur ERP...");

      // 1. Create Module as PM
      sessionUtils.setToken("mock_pm");
      const modRes = await ModuleService.create({
        project_id: "PROJ-ERP-01",
        code: `MOD-E4-${Date.now().toString().slice(-4)}`,
        name: "Tasklist dan Eksekusi Agile",
        description:
          "Pengelolaan hierarki pekerjaan, alur dual-approval rilis, dan pelacakan agile sprint.",
      });

      const moduleId = modRes.data.id;

      // 2. Create Features
      const ftr1Res = await ModuleService.createFeature(moduleId, {
        code: `FTR-01-${Date.now().toString().slice(-3)}`,
        name: "Dual-Approval Task Release Gate",
        description: "Verifikasi kelayakan teknis TL dan anggaran PM sebelum rilis.",
      });
      const feature1Id = ftr1Res.data.id;

      const ftr2Res = await ModuleService.createFeature(moduleId, {
        code: `FTR-02-${Date.now().toString().slice(-3)}`,
        name: "Agile Kanban Board & Rework Loop",
        description: "Papan visual interaktif 5 tahap dengan otomasi pengembalian kartu bug.",
      });
      const feature2Id = ftr2Res.data.id;

      const deadline = format(addDays(new Date(), 2), "yyyy-MM-dd'T'17:00:00.000'Z'");

      // 3. Create Task 1 (DRAFT)
      sessionUtils.setToken("mock_tl");
      await TaskService.create({
        module_id: moduleId,
        feature_id: feature1Id,
        task_code: `TSK-${Math.floor(10 + Math.random() * 89)}`,
        title: "Penyusunan Kontrak REST API Modul E-4",
        description:
          "Spesifikasi endpoint hierarki modul, approval rilis, dan progres deliverable.",
        complexity_weight: "MEDIUM",
        estimated_man_hours: 8.0,
        target_deadline: deadline,
      });

      // 4. Create Task 2 (RELEASED via Dual Approval)
      const t2 = await TaskService.create({
        module_id: moduleId,
        feature_id: feature1Id,
        task_code: `TSK-${Math.floor(10 + Math.random() * 89)}`,
        title: "Implementasi Gatekeeper Dual-Approval Task Release",
        description: "Pemisahan hak approval mandiri TL dan PM dengan respon 403 bagi role lain.",
        complexity_weight: "HIGH",
        estimated_man_hours: 14.5,
        target_deadline: deadline,
      });
      // TL Approves
      sessionUtils.setToken("mock_tl");
      await ApprovalService.submitApproval(t2.data.id, {
        status: "APPROVED",
        notes: "Estimasi man-hour dan arsitektur telah diverifikasi TL.",
      });
      // PM Approves -> Becomes RELEASED!
      sessionUtils.setToken("mock_pm");
      await ApprovalService.submitApproval(t2.data.id, {
        status: "APPROVED",
        notes: "Anggaran sprint dan target tenggat disetujui PM.",
      });

      // 5. Create Task 3 (DEVELOPMENT with PIC)
      const t3 = await TaskService.create({
        module_id: moduleId,
        feature_id: feature2Id,
        task_code: `TSK-${Math.floor(10 + Math.random() * 89)}`,
        title: "Pembuatan Komponen Visual Kanban 5 Kolom",
        description: "Antarmuka Kanban dengan kartu interaktif dan indikator tag rework.",
        complexity_weight: "MEDIUM",
        estimated_man_hours: 12.0,
        target_deadline: deadline,
      });
      sessionUtils.setToken("mock_tl");
      await ApprovalService.submitApproval(t3.data.id, { status: "APPROVED", notes: "OK" });
      sessionUtils.setToken("mock_pm");
      await ApprovalService.submitApproval(t3.data.id, { status: "APPROVED", notes: "OK" });
      // Developer moves to DEVELOPMENT
      sessionUtils.setToken("mock_dev");
      await TaskService.updateStatus(
        t3.data.id,
        "DEVELOPMENT",
        "01926df4-0003-7000-8000-000000000003",
        "Ariel (Frontend Dev)",
      );

      // 6. Create Task 4 (TESTING with Rework History)
      const t4 = await TaskService.create({
        module_id: moduleId,
        feature_id: feature2Id,
        task_code: `TSK-${Math.floor(10 + Math.random() * 89)}`,
        title: "Otomasi Alur Rework Kartu Tugas Gagal Uji",
        description: "Pembalikan otomatis kartu ke kolom Development saat hasil testing Rejected.",
        complexity_weight: "HIGH",
        estimated_man_hours: 16.0,
        target_deadline: deadline,
      });
      sessionUtils.setToken("mock_tl");
      await ApprovalService.submitApproval(t4.data.id, { status: "APPROVED", notes: "OK" });
      sessionUtils.setToken("mock_pm");
      await ApprovalService.submitApproval(t4.data.id, { status: "APPROVED", notes: "OK" });
      sessionUtils.setToken("mock_dev");
      await TaskService.updateStatus(
        t4.data.id,
        "DEVELOPMENT",
        "01926df4-0003-7000-8000-000000000003",
        "Ariel (Frontend Dev)",
      );
      await TaskService.updateStatus(t4.data.id, "CODE_REVIEW");
      await TaskService.updateStatus(t4.data.id, "TESTING");

      // 7. Create Task 5 (DONE via Two-Gate DoD)
      const t5 = await TaskService.create({
        module_id: moduleId,
        feature_id: feature1Id,
        task_code: `TSK-${Math.floor(10 + Math.random() * 89)}`,
        title: "Mesin Kalkulasi Rasio Progres Deliverable Man-Hour",
        description:
          "Rumus matematis (Man-hour DONE / Total Deliverable) * 100% dengan zero-division safe.",
        complexity_weight: "LOW",
        estimated_man_hours: 6.5,
        target_deadline: deadline,
      });
      sessionUtils.setToken("mock_tl");
      await ApprovalService.submitApproval(t5.data.id, { status: "APPROVED", notes: "OK" });
      sessionUtils.setToken("mock_pm");
      await ApprovalService.submitApproval(t5.data.id, { status: "APPROVED", notes: "OK" });
      sessionUtils.setToken("mock_dev");
      await TaskService.updateStatus(
        t5.data.id,
        "DEVELOPMENT",
        "01926df4-0003-7000-8000-000000000003",
        "Ariel (Frontend Dev)",
      );
      await TaskService.updateStatus(t5.data.id, "TESTING");
      // PM verifies Gate 1
      sessionUtils.setToken("mock_pm");
      await ReviewService.pmVerify(t5.data.id);
      // TL sign-off Gate 2 -> Status DONE!
      sessionUtils.setToken("mock_tl");
      await ReviewService.tlSignoff(t5.data.id);

      toast.success("Data demonstrasi modul & tugas sprint berhasil dibuat lengkap!");
    } catch (err: any) {
      toast.error(err.message || "Gagal memuat data demonstrasi");
    } finally {
      if (originalToken) {
        sessionUtils.setToken(originalToken);
      } else {
        sessionUtils.clearSession();
      }
      if (originalRole) {
        sessionUtils.setActiveRole(originalRole);
      }
      setSeeding(false);
      await queryClient.invalidateQueries();
    }
  };

  return { seed, seeding };
};

export default useSeedDemoData;
