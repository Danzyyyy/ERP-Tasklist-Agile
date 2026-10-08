<?php

namespace App\Http\Requests;

use App\Enums\ReviewResult;
use App\Enums\ReviewType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class ReviewLogRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'review_type' => ['required', new Enum(ReviewType::class)],
            'result' => ['required', new Enum(ReviewResult::class)],
            'notes' => ['nullable', 'string'],
        ];
    }
}
