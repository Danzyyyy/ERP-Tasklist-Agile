<?php

namespace App\Models;

use App\Models\Traits\HasUuidV7;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TaskDependency extends Model
{
    use HasFactory, HasUuidV7;

    protected $fillable = [
        'task_id',
        'prerequisite_task_id',
        'dependency_type',
    ];

    public function task(): BelongsTo
    {
        return $this->belongsTo(Task::class, 'task_id');
    }

    public function prerequisiteTask(): BelongsTo
    {
        return $this->belongsTo(Task::class, 'prerequisite_task_id');
    }
}
