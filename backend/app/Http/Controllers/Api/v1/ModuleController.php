<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Models\Feature;
use App\Models\Module;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ModuleController extends Controller
{
    /**
     * List all modules with features.
     */
    public function index(Request $request): JsonResponse
    {
        $projectId = $request->input('project_id', 'PROJ-ERP-01');
        $modules = Module::with('features')->where('project_id', $projectId)->get();

        return response()->json([
            'status' => 'success',
            'data' => $modules,
        ]);
    }

    /**
     * Store new module.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'project_id' => ['required', 'string'],
            'code' => ['required', 'string', 'unique:modules,code'],
            'name' => ['required', 'string'],
            'description' => ['nullable', 'string'],
        ]);

        $module = Module::create($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Modul berhasil dibuat.',
            'data' => $module,
        ], 201);
    }

    /**
     * Store new feature under a module.
     */
    public function storeFeature(Request $request, string $moduleId): JsonResponse
    {
        $module = Module::findOrFail($moduleId);

        $validated = $request->validate([
            'code' => ['required', 'string', 'unique:features,code'],
            'name' => ['required', 'string'],
            'description' => ['nullable', 'string'],
        ]);

        $feature = $module->features()->create($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Fitur berhasil dibuat.',
            'data' => $feature,
        ], 201);
    }
}
