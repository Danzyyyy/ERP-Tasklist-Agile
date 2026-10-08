<?php

namespace App\Models;

use App\Enums\ComplexityWeight;
use App\Enums\TaskStatus;
use App\Models\Traits\HasUuidV7;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Task extends Model
{
    use HasFactory, HasUuidV7;

    protected $fillable = [
        'module_id',
        'feature_id',
        'task_code',
        'title',
        'description',
        'complexity_weight',
        'estimated_man_hours',
        'actual_man_hours',
        'target_deadline',
        'status',
        'is_pm_verified',
        'pm_verified_at',
        'pm_verified_by',
        'is_tl_signed',
        'tl_signed_at',
        'tl_signed_by',
        'assignee_id',
        'assignee_name',
        'created_by',
    ];

    protected $casts = [
        'complexity_weight' => ComplexityWeight::class,
        'status' => TaskStatus::class,
        'estimated_man_hours' => 'decimal:2',
        'actual_man_hours' => 'decimal:2',
        'target_deadline' => 'datetime',
        'is_pm_verified' => 'boolean',
        'pm_verified_at' => 'datetime',
        'is_tl_signed' => 'boolean',
        'tl_signed_at' => 'datetime',
    ];

    public function module(): BelongsTo
    {
        return $this->belongsTo(Module::class);
    }

    public function feature(): BelongsTo
    {
        return $this->belongsTo(Feature::class);
    }

    public function approvals(): HasMany
    {
        return $this->hasMany(TaskApproval::class);
    }

    public function reviewLogs(): HasMany
    {
        return $this->hasMany(TaskReviewLog::class)->orderBy('created_at', 'desc');
    }

    public function dependencies(): HasMany
    {
        return $this->hasMany(TaskDependency::class, 'task_id');
    }

    public function prerequisiteFor(): HasMany
    {
        return $this->hasMany(TaskDependency::class, 'prerequisite_task_id');
    }
}
