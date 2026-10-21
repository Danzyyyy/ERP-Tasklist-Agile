<?php

namespace App\Http\Requests;

use App\Enums\ApprovalStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class ApprovalRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        if (!$this->has('status') && $this->has('decision')) {
            $this->merge(['status' => $this->input('decision')]);
        }
    }

    public function rules(): array
    {
        return [
            'status' => ['required', new Enum(ApprovalStatus::class)],
            'notes' => ['nullable', 'string'],
        ];
    }
}
