import React from 'react';
import { 
  Clock, 
  Calendar, 
  User, 
  RotateCcw, 
  ShieldCheck, 
  Code2, 
  Bug, 
  Award,
  ArrowRight
} from 'lucide-react';
import { Task, UserRole } from '../types/task.types';

interface KanbanCardProps {
  task: Task;
  currentRole: UserRole;
  onOpenApproval: (task: Task) => void;
  onOpenReview: (task: Task, type: 'CODE_REVIEW' | 'TESTING') => void;
  onOpenSignoff: (task: Task) => void;
  onMoveToDevelopment: (task: Task) => void;
  onMoveToCodeReview: (task: Task) => void;
}

export const KanbanCard: React.FC<KanbanCardProps> = ({
  task,
  currentRole,
  onOpenApproval,
  onOpenReview,
  onOpenSignoff,
  onMoveToDevelopment,
  onMoveToCodeReview,
}) => {
  // Check if rework happened
  const hasReworkLog = task.reviewLogs?.some((log) => log.result === 'REJECTED');

  // SLA Calculation
  const deadlineDate = new Date(task.target_deadline);
  const isPastDeadline = deadlineDate < new Date() && task.status !== 'DONE';

  // Complexity Badge style
  const getComplexityColor = (weight: string) => {
    switch (weight) {
      case 'HIGH':
        return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
      case 'MEDIUM':
        return 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30';
      case 'LOW':
      default:
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
    }
  };

  return (
    <div className="group relative bg-slate-850 hover:bg-slate-800/90 border border-slate-700/70 hover:border-indigo-500/50 rounded-2xl p-4 shadow-lg transition-all duration-200">
      
      {/* Top Header: Code, Complexity, Rework Tag */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="font-mono text-xs font-bold text-indigo-400 tracking-wide">
          {task.task_code}
        </span>
        
        <div className="flex items-center space-x-1.5">
          {hasReworkLog && task.status === 'DEVELOPMENT' && (
            <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse">
              <RotateCcw className="w-3 h-3" />
              <span>Rework</span>
            </span>
          )}
          
          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${getComplexityColor(task.complexity_weight)}`}>
            {task.complexity_weight}
          </span>
        </div>
      </div>

      {/* Title */}
      <h4 className="text-xs font-bold text-slate-100 group-hover:text-white line-clamp-2 mb-2 leading-relaxed">
        {task.title}
      </h4>

      {/* Description Snippet */}
      {task.description && (
        <p className="text-[11px] text-slate-400 line-clamp-2 mb-3 leading-normal">
          {task.description}
        </p>
      )}

      {/* Metrics Row: Man-Hours & SLA H-1 */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 py-2 border-y border-slate-800/80 mb-3">
        <div className="flex items-center space-x-1">
          <Clock className="w-3.5 h-3.5 text-indigo-400" />
          <span>
            <strong className="text-slate-200">{task.estimated_man_hours}h</strong> est.
          </span>
        </div>

        <div className={`flex items-center space-x-1 ${isPastDeadline ? 'text-rose-400 font-bold' : 'text-slate-400'}`}>
          <Calendar className="w-3.5 h-3.5" />
          <span>{deadlineDate.toLocaleDateString('id-ID', { month: 'short', day: 'numeric' })}</span>
        </div>
      </div>

      {/* Assignee PIC */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-1.5 min-w-0">
          <div className="w-5 h-5 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 text-[10px] font-bold">
            <User className="w-3 h-3" />
          </div>
          <span className="text-[11px] text-slate-300 truncate">
            {task.assignee_name || <em className="text-amber-400/80 font-normal">Belum ada PIC</em>}
          </span>
        </div>

        {task.module && (
          <span className="text-[10px] text-slate-400 font-mono">
            {task.module.code}
          </span>
        )}
      </div>

      {/* Action Buttons depending on Column/Stage */}
      <div className="pt-2 border-t border-slate-800/60">
        
        {/* RELEASED -> Start Dev */}
        {task.status === 'RELEASED' && (
          <button
            onClick={() => onMoveToDevelopment(task)}
            className="w-full flex items-center justify-center space-x-1.5 py-1.5 px-3 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/20 transition"
          >
            <span>Mulai Development</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}

        {/* DEVELOPMENT -> Submit Code Review */}
        {task.status === 'DEVELOPMENT' && (
          <button
            onClick={() => onMoveToCodeReview(task)}
            className="w-full flex items-center justify-center space-x-1.5 py-1.5 px-3 rounded-xl text-xs font-bold text-white bg-slate-750 hover:bg-slate-700 border border-slate-600 transition"
          >
            <Code2 className="w-3.5 h-3.5 text-indigo-400" />
            <span>Ajukan Code Review</span>
          </button>
        )}

        {/* CODE_REVIEW -> Perform Review */}
        {task.status === 'CODE_REVIEW' && (
          <button
            onClick={() => onOpenReview(task, 'CODE_REVIEW')}
            className="w-full flex items-center justify-center space-x-1.5 py-1.5 px-3 rounded-xl text-xs font-bold text-indigo-200 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 transition"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Evaluasi Code Review</span>
          </button>
        )}

        {/* TESTING -> Perform QA Test or Sign-off */}
        {task.status === 'TESTING' && (
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => onOpenReview(task, 'TESTING')}
              className="flex items-center justify-center space-x-1 py-1.5 px-2 rounded-xl text-[11px] font-bold text-purple-200 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 transition"
            >
              <Bug className="w-3 h-3" />
              <span>QA Test</span>
            </button>
            <button
              onClick={() => onOpenSignoff(task)}
              className="flex items-center justify-center space-x-1 py-1.5 px-2 rounded-xl text-[11px] font-bold text-emerald-200 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 transition"
            >
              <Award className="w-3 h-3" />
              <span>Sign-off</span>
            </button>
          </div>
        )}

        {/* DONE -> Verified Badge */}
        {task.status === 'DONE' && (
          <div className="flex items-center justify-center space-x-1.5 py-1.5 rounded-xl text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Disahkan TL & PM</span>
          </div>
        )}

      </div>

    </div>
  );
};
