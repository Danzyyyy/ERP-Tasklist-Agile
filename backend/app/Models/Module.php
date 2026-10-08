<?php

namespace App\Models;

use App\Models\Traits\HasUuidV7;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Module extends Model
{
    use HasFactory, HasUuidV7;

    protected $fillable = [
        'project_id',
        'code',
        'name',
        'description',
    ];

    public function features(): HasMany
    {
        return $this->hasMany(Feature::class);
    }

    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class);
    }
}
