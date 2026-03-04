<?php

declare(strict_types=1);

namespace App\Notifications\Channels;

use App\Models\EmailNotification;
use Illuminate\Notifications\Notification;

class EmailNotificationChannel
{
    public function send($notifiable, Notification $notification): void
    {
        $data = $notification->toEmailNotification($notifiable);

        EmailNotification::create([
            'user_id' => $notifiable->id,
            'subject' => $data['subject'],
            'body' => $data['body'],
        ]);
    }
}
