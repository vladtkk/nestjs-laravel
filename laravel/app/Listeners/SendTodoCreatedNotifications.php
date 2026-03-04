<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Events\TodoCreated;
use App\Notifications\TodoCreatedNotification;
use Illuminate\Contracts\Queue\ShouldQueue;

class SendTodoCreatedNotifications implements ShouldQueue
{
    public function handle(TodoCreated $event): void
    {
        $event->todo->user->notify(new TodoCreatedNotification($event->todo));
    }
}
