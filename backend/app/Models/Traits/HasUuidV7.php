<?php

namespace App\Models\Traits;

use Illuminate\Support\Str;

trait HasUuidV7
{
    /**
     * Boot function from Laravel to automatically generate UUID v7 for model primary key.
     */
    protected static function bootHasUuidV7(): void
    {
        static::creating(function ($model) {
            $keyName = $model->getKeyName();
            if (empty($model->{$keyName})) {
                $model->{$keyName} = (string) Str::uuid7();
            }
        });
    }

    /**
     * Get the value indicating whether the IDs are incrementing.
     */
    public function getIncrementing(): bool
    {
        return false;
    }

    /**
     * Get the auto-incrementing key type.
     */
    public function getKeyType(): string
    {
        return 'string';
    }
}
