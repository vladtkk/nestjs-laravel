import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationChannel } from './notification-channel.abstract';
import { NotificationMessageDto } from '../dto/notification-message.dto';
import { InAppNotification } from '../entities/in-app-notification.entity';
import { NotificationChannelType } from '../notification.constants';

@Injectable()
export class InAppChannel extends NotificationChannel {
  private readonly logger = new Logger(InAppChannel.name);

  constructor(
    @InjectRepository(InAppNotification)
    private readonly notificationRepository: Repository<InAppNotification>,
  ) {
    super();
  }

  getName(): NotificationChannelType {
    return NotificationChannelType.IN_APP;
  }

  async send(message: NotificationMessageDto): Promise<void> {
    const notification = this.notificationRepository.create({
      userId: message.userId,
      message: `${message.subject}: ${message.body}`,
    });
    await this.notificationRepository.save(notification);

    this.logger.log(
      `In-App notification saved for user ${message.userId} | Subject: ${message.subject}`,
    );
  }
}
