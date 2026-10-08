<?php

namespace App\Enums;

enum ComplexityWeight: string
{
    case LOW = 'LOW';
    case MEDIUM = 'MEDIUM';
    case HIGH = 'HIGH';

    public function label(): string
    {
        return match ($this) {
            self::LOW => 'Low Complexity',
            self::MEDIUM => 'Medium Complexity',
            self::HIGH => 'High Complexity',
        };
    }
}
