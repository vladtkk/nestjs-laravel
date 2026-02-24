import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { NotificationChannel } from './notification-channel.abstract';
import { NotificationMessageDto } from '../dto/notification-message.dto';
import { InAppNotification } from '../entities/in-app-notification.entity';

@Injectable()
export class InAppChannel extends NotificationChannel {
  constructor(
    @InjectRepository(InAppNotification)
    private readonly notificationRepository: Repository<InAppNotification>,
  ) {
    super();
  }

  getName(): string {
    return 'IN_APP';
  }

  async send(message: NotificationMessageDto): Promise<void> {
    const notification = this.notificationRepository.create({
      userId: message.userId,
      message: `${message.subject}: ${message.body}`,
    });

    await this.notificationRepository.save(notification);
  }
}
