<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Models\Module;
use App\Services\ProgressCalculationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProgressController extends Controller
{
    public function __construct(
        protected ProgressCalculationService $progressService
    ) {}

    /**
     * Get deliverable progress for a given project (API-K04-01).
     * Consumed by E-5, D-3, D-4 modules.
     */
    public function getDeliverableProgress(string $projectId): JsonResponse
    {
        $metrics = $this->progressService->calculateProgress(projectId: $projectId);

        return response()->json([
            'status' => 'success',
            'projectId' => $projectId,
            'data' => $metrics,
        ]);
    }

    /**
     * Get progress for a specific module.
     */
    public function getModuleProgress(string $moduleId): JsonResponse
    {
        $module = Module::findOrFail($moduleId);
        $metrics = $this->progressService->calculateProgress(moduleId: $moduleId);

        return response()->json([
            'status' => 'success',
            'moduleId' => $moduleId,
            'moduleName' => $module->name,
            'moduleCode' => $module->code,
            'data' => $metrics,
        ]);
    }
}
