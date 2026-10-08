<?php

namespace App\Enums;

enum TaskStatus: string
{
    case DRAFT = 'DRAFT';
    case RELEASED = 'RELEASED';
    case DEVELOPMENT = 'DEVELOPMENT';
    case CODE_REVIEW = 'CODE_REVIEW';
    case TESTING = 'TESTING';
    case DONE = 'DONE';

    public function isBoardColumn(): bool
    {
        return in_array($this, [
            self::RELEASED,
            self::DEVELOPMENT,
            self::CODE_REVIEW,
            self::TESTING,
            self::DONE,
        ]);
    }
}
