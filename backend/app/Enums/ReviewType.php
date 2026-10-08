<?php

namespace App\Enums;

enum ReviewType: string
{
    case CODE_REVIEW = 'CODE_REVIEW';
    case TESTING = 'TESTING';
}
