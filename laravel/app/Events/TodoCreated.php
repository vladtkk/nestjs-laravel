<?php

declare(strict_types=1);

namespace App\Events;

use App\Models\Todo;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class TodoCreated
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public readonly Todo $todo,
    ) {}
}
