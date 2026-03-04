<?php

declare(strict_types=1);

namespace App\Notifications;

use App\Models\Todo;
use App\Notifications\Channels\EmailNotificationChannel;
use App\Notifications\Channels\InAppNotificationChannel;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class TodoCreatedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public readonly Todo $todo,
    ) {}

    public function via($notifiable): array
    {
        return [InAppNotificationChannel::class, EmailNotificationChannel::class];
    }

    public function toInApp($notifiable): array
    {
        return [
            'subject' => "New TODO Created: {$this->todo->title}",
            'body' => "You have successfully created a new task with the status: {$this->todo->status->value}.",
        ];
    }

    public function toEmailNotification($notifiable): array
    {
        return [
            'subject' => "New TODO Created: {$this->todo->title}",
            'body' => "You have successfully created a new task with the status: {$this->todo->status->value}.",
        ];
    }
}
