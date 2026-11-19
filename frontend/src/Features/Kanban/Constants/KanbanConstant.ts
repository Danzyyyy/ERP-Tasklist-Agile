// src/Features/Kanban/Constants/KanbanConstant.ts
import type { KanbanColumnDef } from "../Types/KanbanType";

export const KANBAN_COLUMNS: readonly KanbanColumnDef[] = [
  {
    id: "RELEASED",
    title: "1. Released Task",
    step: 1,
    description: "Tugas telah disetujui TL & PM, siap ditarik ke pengerjaan",
    tone: "indigo",
  },
  {
    id: "DEVELOPMENT",
    title: "2. In Development",
    step: 2,
    description: "Tugas sedang dikerjakan oleh Developer (Wajib PIC)",
    tone: "blue",
  },
  {
    id: "CODE_REVIEW",
    title: "3. Code Review",
    step: 3,
    description: "Pemeriksaan arsitektur dan kualitas kode oleh peer",
    tone: "purple",
  },
  {
    id: "TESTING",
    title: "4. QA Testing",
    step: 4,
    description: "Verifikasi skenario pengujian oleh QA Tester",
    tone: "cyan",
  },
  {
    id: "DONE",
    title: "5. Definition of Done",
    step: 5,
    description: "Lulus verifikasi PM & otorisasi pengesahan akhir oleh TL (Terminal)",
    tone: "emerald",
  },
] as const;

export const DEMO_DEVELOPERS = [
  {
    id: "01926df4-0003-7000-8000-000000000003",
    name: "Ariel (Frontend Dev)",
    role: "Frontend Developer",
  },
  {
    id: "01926df4-0005-7000-8000-000000000005",
    name: "Muhamad Fajri (Backend Dev)",
    role: "Backend Developer",
  },
];
