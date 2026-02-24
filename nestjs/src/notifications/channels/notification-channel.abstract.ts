import { NotificationMessageDto } from '../dto/notification-message.dto';
import { NotificationChannelType } from '../notification.constants';

export abstract class NotificationChannel {
  abstract getName(): NotificationChannelType;

  abstract send(message: NotificationMessageDto): Promise<void>;
}
