import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { NotificationChannel } from './notification-channel.abstract';
import { NotificationMessageDto } from '../dto/notification-message.dto';
import { EmailNotification } from '../entities/email-notification.entity';

@Injectable()
export class EmailChannel extends NotificationChannel {
  private readonly logger = new Logger(EmailChannel.name);

  constructor(
    @InjectRepository(EmailNotification)
    private readonly notificationRepository: Repository<EmailNotification>,
  ) {
    super();
  }

  getName(): string {
    return 'EMAIL';
  }

  async send(message: NotificationMessageDto): Promise<void> {
    const notification = this.notificationRepository.create({
      userId: message.userId,
      subject: message.subject,
      body: message.body,
    });

    await this.notificationRepository.save(notification);

    this.logger.log(
      `Sending email to user ${message.userId} | Subject: ${message.subject} | Body: ${message.body}`,
    );
  }
}
