<?php

namespace App\Models;

use App\Enums\ApprovalStatus;
use App\Models\Traits\HasUuidV7;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TaskApproval extends Model
{
    use HasFactory, HasUuidV7;

    protected $fillable = [
        'task_id',
        'role',
        'status',
        'approver_id',
        'approver_name',
        'notes',
        'actioned_at',
    ];

    protected $casts = [
        'status' => ApprovalStatus::class,
        'actioned_at' => 'datetime',
    ];

    public function task(): BelongsTo
    {
        return $this->belongsTo(Task::class);
    }
}
