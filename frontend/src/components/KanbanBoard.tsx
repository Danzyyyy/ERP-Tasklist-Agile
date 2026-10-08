import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Code2, 
  PlayCircle, 
  Sparkles, 
  Bug, 
  Award,
  Layers,
  Clock
} from 'lucide-react';
import { Task, TaskStatus, UserRole } from '../types/task.types';
import { KanbanCard } from './KanbanCard';
import { ApprovalModal } from './ApprovalModal';
import { ReviewModal } from './ReviewModal';
import { SignOffModal } from './SignOffModal';
import { useUpdateTaskStatus } from '../hooks/useTasks';

interface KanbanBoardProps {
  tasks: Task[];
  currentRole: UserRole;
  onRefresh?: () => void;
}

const COLUMNS: {
  id: TaskStatus;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  badgeBg: string;
  desc: string;
}[] = [
  {
    id: 'RELEASED',
    title: 'Released Task',
    icon: Sparkles,
    color: 'text-sky-400',
    badgeBg: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
    desc: 'Lolos Dual-Approval (TL & PM)',
  },
  {
    id: 'DEVELOPMENT',
    title: 'Development',
    icon: PlayCircle,
    color: 'text-indigo-400',
    badgeBg: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    desc: 'Sedang dikerjakan oleh Developer PIC',
  },
  {
    id: 'CODE_REVIEW',
    title: 'Code Review',
    icon: Code2,
    color: 'text-amber-400',
    badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    desc: 'Pemeriksaan kualitas & kepatuhan kode',
  },
  {
    id: 'TESTING',
    title: 'Testing (QA)',
    icon: Bug,
    color: 'text-purple-400',
    badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    desc: 'Uji fungsional & verifikasi bug',
  },
  {
    id: 'DONE',
    title: 'Done',
    icon: Award,
    color: 'text-emerald-400',
    badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    desc: 'Verifikasi PM + Sign-off TL',
  },
];

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  tasks,
  currentRole,
}) => {
  const updateStatusMutation = useUpdateTaskStatus();

  // Modals state
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [approvalModalOpen, setApprovalModalOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewType, setReviewType] = useState<'CODE_REVIEW' | 'TESTING'>('CODE_REVIEW');
  const [signoffModalOpen, setSignoffModalOpen] = useState(false);

  // Quick Action: Move to DEVELOPMENT with PIC Assignee check
  const handleMoveToDevelopment = async (task: Task) => {
    let assigneeId = task.assignee_id;
    let assigneeName = task.assignee_name;

    if (!assigneeId) {
      const name = prompt(
        'Tentukan pelaksana (assignee) sebelum memulai development (SOP-08 / FTR-K04-04):',
        currentRole === 'DEVELOPER' ? 'Ariel (Frontend Dev)' : 'Fauzan (TL)'
      );
      if (!name) return;
      assigneeId = '01926df4-0003-7000-8000-000000000003';
      assigneeName = name;
    }

    try {
      await updateStatusMutation.mutateAsync({
        taskId: task.id,
        status: 'DEVELOPMENT',
        assignee_id: assigneeId,
        assignee_name: assigneeName,
      });
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal memindahkan tugas ke Development.');
    }
  };

  // Quick Action: Move to CODE_REVIEW
  const handleMoveToCodeReview = async (task: Task) => {
    try {
      await updateStatusMutation.mutateAsync({
        taskId: task.id,
        status: 'CODE_REVIEW',
      });
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal memindahkan tugas ke Code Review.');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* 5-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {COLUMNS.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.id);
          const colHours = colTasks.reduce((acc, curr) => acc + Number(curr.estimated_man_hours), 0);
          const Icon = col.icon;

          return (
            <div
              key={col.id}
              className="flex flex-col bg-slate-900/80 border border-slate-800 rounded-3xl p-3 min-h-[600px] shadow-xl"
            >
              {/* Column Header */}
              <div className="p-3 mb-3 rounded-2xl bg-slate-850/80 border border-slate-800/80">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-2">
                    <Icon className={`w-4 h-4 ${col.color}`} />
                    <h3 className="text-xs font-bold text-white tracking-wide">
                      {col.title}
                    </h3>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${col.badgeBg}`}>
                    {colTasks.length}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
                  <span className="truncate pr-1 text-[10px] text-slate-400">
                    {col.desc}
                  </span>
                  <div className="flex items-center space-x-1 shrink-0 font-medium">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{colHours}h</span>
                  </div>
                </div>
              </div>

              {/* Cards Container */}
              <div className="flex-1 space-y-3 overflow-y-auto pr-1">
                {colTasks.length === 0 ? (
                  <div className="h-40 border-2 border-dashed border-slate-800/80 rounded-2xl flex flex-col items-center justify-center p-4 text-center">
                    <Layers className="w-6 h-6 text-slate-700 mb-1" />
                    <span className="text-xs text-slate-400 font-medium">
                      Tidak ada kartu tugas
                    </span>
                  </div>
                ) : (
                  colTasks.map((task) => (
                    <KanbanCard
                      key={task.id}
                      task={task}
                      currentRole={currentRole}
                      onOpenApproval={(t) => {
                        setSelectedTask(t);
                        setApprovalModalOpen(true);
                      }}
                      onOpenReview={(t, type) => {
                        setSelectedTask(t);
                        setReviewType(type);
                        setReviewModalOpen(true);
                      }}
                      onOpenSignoff={(t) => {
                        setSelectedTask(t);
                        setSignoffModalOpen(true);
                      }}
                      onMoveToDevelopment={handleMoveToDevelopment}
                      onMoveToCodeReview={handleMoveToCodeReview}
                    />
                  ))
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* Modals */}
      <ApprovalModal
        task={selectedTask}
        isOpen={approvalModalOpen}
        onClose={() => {
          setApprovalModalOpen(false);
          setSelectedTask(null);
        }}
        currentRole={currentRole}
      />

      <ReviewModal
        task={selectedTask}
        isOpen={reviewModalOpen}
        onClose={() => {
          setReviewModalOpen(false);
          setSelectedTask(null);
        }}
        reviewType={reviewType}
        currentRole={currentRole}
      />

      <SignOffModal
        task={selectedTask}
        isOpen={signoffModalOpen}
        onClose={() => {
          setSignoffModalOpen(false);
          setSelectedTask(null);
        }}
        currentRole={currentRole}
      />

    </div>
  );
};
