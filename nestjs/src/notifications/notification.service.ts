import { Inject, Injectable, Logger } from '@nestjs/common';

import { NotificationChannel } from './channels/notification-channel.abstract';
import { NotificationMessageDto } from './dto/notification-message.dto';
import { CHANNEL_STRATEGIES } from './notification.constants';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    @Inject(CHANNEL_STRATEGIES)
    private readonly channels: NotificationChannel[],
  ) {}

  async notify(
    message: NotificationMessageDto,
    channels: string[],
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

    await Promise.all(
      matchedChannels.map((channel) => channel.send(message)),
    );
  }
}
