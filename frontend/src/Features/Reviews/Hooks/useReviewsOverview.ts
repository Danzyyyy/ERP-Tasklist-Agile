// src/Features/Reviews/Hooks/useReviewsOverview.ts
import { useState, useMemo } from "react";
import { useGetTaskList } from "@/Hooks/useGetTaskList";
import { isTaskRework } from "@/Utils/taskUtils";
import type { Task } from "@/Types/task";

export type ReviewTabType = "ALL" | "CODE_REVIEW" | "TESTING" | "SIGNOFF";

export function useReviewsOverview() {
  const [tab, setTab] = useState<ReviewTabType>("ALL");

  const [activeReviewTask, setActiveReviewTask] = useState<Task | null>(null);
  const [activeSignOffTask, setActiveSignOffTask] = useState<Task | null>(null);
  const [activeDetailTask, setActiveDetailTask] = useState<Task | null>(null);

  // Menggunakan query filter status kanonis backend: GET /tasks?status=...
  const queryParams = useMemo(() => {
    if (tab === "CODE_REVIEW") return { status: "CODE_REVIEW" as const };
    if (tab === "TESTING") return { status: "TESTING" as const };
    return {};
  }, [tab]);

  const { data: filteredTasks = [], isLoading: isFilteredLoading, refetch: refetchFiltered } =
    useGetTaskList(queryParams);
  const { data: allTasks = [], isLoading: isAllLoading, refetch: refetchAll } =
    useGetTaskList({});

  const isLoading = isFilteredLoading || isAllLoading;

  const refetch = async () => {
    await Promise.all([refetchFiltered(), refetchAll()]);
  };

  // Jumlah antrean berdasarkan status aktual tugas dari backend
  const tabCounts = useMemo(() => {
    let codeReview = 0;
    let testing = 0;
    let signoff = 0;
    let all = 0;

    allTasks.forEach((t) => {
      const isCr = t.status === "CODE_REVIEW";
      const isTest = t.status === "TESTING";
      const isSignOff = t.status === "TESTING" || t.status === "DONE";
      const hasActiveRework = isTaskRework(t);

      if (isCr) codeReview++;
      if (isTest) testing++;
      if (isSignOff) signoff++;

      if (isCr || isTest || t.status === "DONE" || hasActiveRework) {
        all++;
      }
    });

    return { codeReview, testing, signoff, all };
  }, [allTasks]);

  // Tasks yang relevan: mengutamakan hasil filter endpoint backend
  const relevantTasks = useMemo(() => {
    if (tab === "CODE_REVIEW" || tab === "TESTING") {
      return filteredTasks;
    }

    return allTasks.filter((t) => {
      const isCr = t.status === "CODE_REVIEW";
      const isTest = t.status === "TESTING";
      const isSignOff = t.status === "TESTING" || t.status === "DONE";
      const hasActiveRework = isTaskRework(t);

      if (tab === "SIGNOFF") return isSignOff;
      return isCr || isTest || t.status === "DONE" || hasActiveRework;
    });
  }, [filteredTasks, allTasks, tab]);

  const getEmptyMessage = () => {
    switch (tab) {
      case "CODE_REVIEW":
        return "Tidak Ada Tugas Dalam Antrean Code Review. Tarik kartu tugas ke kolom Code Review pada Papan Kanban untuk memulai peninjauan kode oleh TL atau PM.";
      case "TESTING":
        return "Tidak Ada Tugas Dalam Antrean QA Testing. Pindahkan tugas ke kolom Testing untuk memulai validasi pengujian dan skenario alur rework.";
      case "SIGNOFF":
        return "Tidak Ada Tugas Dalam Gerbang Sign-Off. Tugas dalam tahap Testing yang siap diverifikasi PM dan disign-off TL akan muncul di sini.";
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

