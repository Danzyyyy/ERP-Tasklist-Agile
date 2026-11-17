// src/Features/Reviews/Hooks/useReviewsOverview.ts
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import TaskService from "@/Services/TaskService";
import { TASK_QUERY_KEYS } from "@/Constants/TaskConstant";
import { useProject } from "@/Contexts/ProjectContext";
import type { Task } from "@/Types/task";

export type ReviewTabType = "ALL" | "CODE_REVIEW" | "TESTING" | "SIGNOFF";

export function useReviewsOverview() {
  const { activeProjectId } = useProject();
  const [tab, setTab] = useState<ReviewTabType>("ALL");

  const [activeReviewTask, setActiveReviewTask] = useState<Task | null>(null);
  const [activeSignOffTask, setActiveSignOffTask] = useState<Task | null>(null);
  const [activeDetailTask, setActiveDetailTask] = useState<Task | null>(null);

  // Single query: Terikat ke activeProjectId dan disaring HANYA untuk tahap Review & Testing riil
  const {
    data: allReviewTasks = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [...TASK_QUERY_KEYS.all, "reviews", activeProjectId],
    queryFn: async () => {
      const res = await TaskService.getAll();
      const rawTasks = res.data || [];

      // Saring berdasarkan proyek aktif
      const projectTasks = rawTasks.filter((t) => {
        if (t.module?.project_id) {
          return t.module.project_id === activeProjectId;
        }
        return activeProjectId === "PROJ-ERP-01";
      });

      // Saring HANYA status yang berada dalam tahap Review & Testing:
      // 1. CODE_REVIEW
      // 2. TESTING
      // 3. DONE (telah disahkan)
      // Tugas DRAFT, RELEASED, dan DEVELOPMENT tidak boleh masuk antrean review!
      return projectTasks.filter(
        (t) =>
          t.status === "CODE_REVIEW" ||
          t.status === "TESTING" ||
          t.status === "DONE",
      );
    },
  });

  // Hitung jumlah antrean per tab berdasarkan tugas riil yang relevan
  const tabCounts = useMemo(() => {
    let codeReview = 0;
    let testing = 0;
    let signoff = 0;

    allReviewTasks.forEach((t) => {
      if (t.status === "CODE_REVIEW") codeReview++;
      if (t.status === "TESTING") testing++;
      if (t.status === "TESTING" || t.status === "DONE") signoff++;
    });

    return {
      codeReview,
      testing,
      signoff,
      all: allReviewTasks.length,
    };
  }, [allReviewTasks]);

  // Tasks yang relevan sesuai tab aktif
  const relevantTasks = useMemo(() => {
    switch (tab) {
      case "CODE_REVIEW":
        return allReviewTasks.filter((t) => t.status === "CODE_REVIEW");
      case "TESTING":
        return allReviewTasks.filter((t) => t.status === "TESTING");
      case "SIGNOFF":
        return allReviewTasks.filter((t) => t.status === "TESTING" || t.status === "DONE");
      case "ALL":
      default:
        return allReviewTasks;
    }
  }, [allReviewTasks, tab]);

  const getEmptyMessage = () => {
    switch (tab) {
      case "CODE_REVIEW":
        return "Tidak Ada Tugas Dalam Antrean Code Review. Tarik kartu tugas ke kolom Code Review pada Papan Kanban untuk memulai peninjauan kode oleh TL atau PM.";
      case "TESTING":
        return "Tidak Ada Tugas Dalam Antrean QA Testing. Pindahkan tugas ke kolom Testing untuk memulai validasi pengujian dan skenario alur rework.";
      case "SIGNOFF":
        return "Tidak Ada Tugas Dalam Gerbang Sign-Off. Tugas dalam tahap Testing yang siap diverifikasi PM dan disahkan TL akan muncul di sini.";
      default:
        return "Tidak Ada Tugas Dalam Antrean Pemeriksaan. Tarik kartu tugas ke kolom Code Review atau Testing pada Papan Kanban untuk memulai pengujian dan alur rework.";
    }
  };

  return {
    tab,
    setTab,
    tabCounts,
    relevantTasks,
    isLoading,
    refetch,
    getEmptyMessage,
    activeReviewTask,
    setActiveReviewTask,
    activeSignOffTask,
    setActiveSignOffTask,
    activeDetailTask,
    setActiveDetailTask,
  };
}

export default useReviewsOverview;
