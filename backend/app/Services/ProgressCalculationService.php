<?php

namespace App\Services;

use App\Enums\TaskStatus;
use App\Models\Module;
use App\Models\Task;

class ProgressCalculationService
{
    /**
     * Calculate deliverable progress based on formula Q-03:
     * (SUM man-hour of DONE tasks / SUM man-hour of all deliverable tasks) * 100
     *
     * @param string|null $projectId
     * @param string|null $moduleId
     * @return array
     */
    public function calculateProgress(?string $projectId = null, ?string $moduleId = null): array
    {
        $query = Task::query();

        if ($moduleId) {
            $query->where('module_id', $moduleId);
        } elseif ($projectId) {
            $query->whereHas('module', function ($q) use ($projectId) {
                $q->where('project_id', $projectId);
            });
        }

        $allTasks = $query->get();
        $totalTasks = $allTasks->count();
        $completedTasks = $allTasks->where('status', TaskStatus::DONE)->count();

        $totalEstimatedManHours = (float) $allTasks->sum('estimated_man_hours');
        $completedManHours = (float) $allTasks->where('status', TaskStatus::DONE)->sum('estimated_man_hours');
        $actualManHoursSpent = (float) $allTasks->sum('actual_man_hours');

        // Division by zero safe guard
        $progressPercentage = $totalEstimatedManHours > 0
            ? round(($completedManHours / $totalEstimatedManHours) * 100, 2)
            : 0.00;

        // SLA H-1 adherence metric
        $now = now();
        $tasksAtRiskOrOverdue = $allTasks->filter(function ($task) use ($now) {
            return $task->status !== TaskStatus::DONE && $task->target_deadline && $task->target_deadline->isPast();
        })->count();

        return [
            'totalTasks' => $totalTasks,
            'completedTasks' => $completedTasks,
            'totalEstimatedManHours' => round($totalEstimatedManHours, 2),
            'completedManHours' => round($completedManHours, 2),
            'actualManHoursSpent' => round($actualManHoursSpent, 2),
            'progressPercentage' => $progressPercentage,
            'tasksAtRiskOrOverdue' => $tasksAtRiskOrOverdue,
            'calculatedAt' => now()->toIso8601String(),
        ];
    }
}
