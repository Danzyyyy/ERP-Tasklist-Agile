<?php

namespace App\Http\Requests;

use App\Enums\ComplexityWeight;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class StoreTaskRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'module_id' => ['required', 'uuid', 'exists:modules,id'],
            'feature_id' => ['nullable', 'uuid', 'exists:features,id'],
            'task_code' => ['required', 'string', 'max:50', 'unique:tasks,task_code'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'complexity_weight' => ['required', new Enum(ComplexityWeight::class)],
            'estimated_man_hours' => ['required', 'numeric', 'min:0.25'],
            'actual_man_hours' => ['nullable', 'numeric', 'min:0'],
            'target_deadline' => ['required', 'date'],
        ];
    }
}
