<?php

namespace App\Models;

use App\Enums\ReviewResult;
use App\Enums\ReviewType;
use App\Models\Traits\HasUuidV7;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TaskReviewLog extends Model
{
    use HasFactory, HasUuidV7;

    protected $fillable = [
        'task_id',
        'review_type',
        'result',
        'reviewer_id',
        'reviewer_name',
        'notes',
    ];

    protected $casts = [
        'review_type' => ReviewType::class,
        'result' => ReviewResult::class,
    ];

    public function task(): BelongsTo
    {
        return $this->belongsTo(Task::class);
    }
}
