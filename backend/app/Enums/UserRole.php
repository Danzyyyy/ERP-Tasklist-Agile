<?php

namespace App\Enums;

enum UserRole: string
{
    case TECHNICAL_LEAD = 'TECHNICAL_LEAD';
    case PROJECT_MANAGER = 'PROJECT_MANAGER';
    case DEVELOPER = 'DEVELOPER';
    case TESTER = 'TESTER';
}
