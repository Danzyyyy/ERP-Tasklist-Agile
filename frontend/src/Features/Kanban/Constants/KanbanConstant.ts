// src/Features/Kanban/Constants/KanbanConstant.ts
import type { KanbanColumnDef } from "../Types/KanbanType";

export const KANBAN_COLUMNS: readonly KanbanColumnDef[] = [
  {
    id: "RELEASED",
    title: "Released Task",
    step: 1,
    description: "Tugas telah disetujui TL & PM, siap ditarik ke pengerjaan",
    tone: "indigo",
  },
  {
    id: "DEVELOPMENT",
    title: "In Development",
    step: 2,
    description: "Tugas sedang dikerjakan oleh Developer (Wajib PIC)",
    tone: "blue",
  },
  {
    id: "CODE_REVIEW",
    title: "Code Review",
    step: 3,
    description: "Pemeriksaan arsitektur dan kualitas kode oleh peer",
    tone: "purple",
  },
  {
    id: "TESTING",
    title: "QA Testing",
    step: 4,
    description: "Verifikasi skenario pengujian oleh QA Tester",
    tone: "cyan",
  },
  {
    id: "DONE",
    title: "Definition of Done",
    step: 5,
    description: "Verifikasi ceklis PM & pengesahan akhir oleh TL",
    tone: "emerald",
  },
] as const;

export const DEMO_DEVELOPERS = [
  { id: "01926df4-0003-7000-8000-000000000003", name: "Ariel (Frontend Dev)", role: "Frontend Developer" },
  { id: "01926df4-0001-7000-8000-000000000001", name: "Fauzan (Technical Lead)", role: "Technical Lead" },
  { id: "01926df4-0002-7000-8000-000000000002", name: "Tubagus M. Wildan (PM)", role: "Project Manager" },
  { id: "01926df4-0004-7000-8000-000000000004", name: "Valdric (QA Tester)", role: "QA Tester" },
] as const;
