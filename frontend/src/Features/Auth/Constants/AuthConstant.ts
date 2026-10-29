// src/Features/Auth/Constants/AuthConstant.ts

export const AUTH_QUERY_KEYS = {
  all: ["auth"] as const,
  me: () => [...AUTH_QUERY_KEYS.all, "me"] as const,
  demoTokens: () => [...AUTH_QUERY_KEYS.all, "demoTokens"] as const,
};

export const ROLE_DETAILS = {
  TECHNICAL_LEAD: {
    label: "Technical Lead (TL)",
    short: "TL",
    badgeTone: "amber",
    authority: "Dual-Approval Task Release & Otorisasi Sign-off Akhir (DONE)",
  },
  PROJECT_MANAGER: {
    label: "Project Manager (PM)",
    short: "PM",
    badgeTone: "indigo",
    authority: "Dual-Approval Task Release & Verifikasi Ceklis PM",
  },
  DEVELOPER: {
    label: "Frontend Developer",
    short: "DEV",
    badgeTone: "blue",
    authority: "Menarik tugas ke Development, update status Kanban, penugasan PIC",
  },
  TESTER: {
    label: "QA Tester",
    short: "QA",
    badgeTone: "cyan",
    authority: "Pengujian QA, pemeriksaan bug, dan pemicu alur Rework ke Development",
  },
} as const;
