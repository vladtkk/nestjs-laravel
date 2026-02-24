import { NotificationMessageDto } from '../dto/notification-message.dto';

export abstract class NotificationChannel {
  abstract getName(): string;

  abstract send(message: NotificationMessageDto): Promise<void>;
}
