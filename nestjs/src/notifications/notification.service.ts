import { Inject, Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { NotificationChannel } from './channels/notification-channel.abstract';
import { NotificationMessageDto } from './dto/notification-message.dto';
import { CHANNEL_STRATEGIES, NotificationChannelType } from './notification.constants';
import { TodoCreatedEvent } from '../todos/events/todo-created.event';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    @Inject(CHANNEL_STRATEGIES)
    private readonly channels: NotificationChannel[],
  ) {}

  @OnEvent(TodoCreatedEvent.EVENT_NAME)
  async handleTodoCreated(event: TodoCreatedEvent): Promise<void> {
    try {
      const message = new NotificationMessageDto();
      message.subject = `New TODO Created: ${event.todo.title}`;
      message.body = `You have successfully created a new task with the status: ${event.todo.status}.`;
      message.userId = event.userId;

      await this.notify(message, [
        NotificationChannelType.IN_APP,
        NotificationChannelType.EMAIL,
      ]);
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error(String(error));
      this.logger.error(
        `Failed to handle todo.created event for user ${event.userId}: ${err.message}`,
        err.stack,
      );
    }
  }

  async notify(
    message: NotificationMessageDto,
    channels: NotificationChannelType[],
  ): Promise<void> {
    const matchedChannels = this.channels.filter((channel) =>
      channels.includes(channel.getName()),
    );

    const unmatchedNames = channels.filter(
      (name) => !this.channels.some((ch) => ch.getName() === name),
    );

    if (unmatchedNames.length > 0) {
      this.logger.warn(
        `Unknown notification channel(s) requested: ${unmatchedNames.join(', ')}`,
      );
    }

    const results = await Promise.allSettled(
      matchedChannels.map((channel) => channel.send(message)),
    );

    results.forEach((result, index) => {
      if (result.status === 'rejected') {
        this.logger.error(
          `Notification channel ${matchedChannels[index].getName()} failed: ${result.reason?.message}`,
          result.reason?.stack,
        );
      }
    });
  }
}
