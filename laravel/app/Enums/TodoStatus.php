<?php

declare(strict_types=1);

namespace App\Enums;

enum TodoStatus: string
{
    case PENDING = 'pending';
    case IN_PROGRESS = 'in-progress';
    case COMPLETED = 'completed';
}
