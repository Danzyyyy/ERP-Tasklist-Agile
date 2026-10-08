<?php

namespace App\Enums;

enum ReviewResult: string
{
    case PASSED = 'PASSED';
    case REJECTED = 'REJECTED';
}
