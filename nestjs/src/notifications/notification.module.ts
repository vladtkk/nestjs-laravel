import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { InAppNotification } from './entities/in-app-notification.entity';
import { EmailNotification } from './entities/email-notification.entity';
import { InAppChannel } from './channels/in-app.channel';
import { EmailChannel } from './channels/email.channel';
import { NotificationService } from './notification.service';
import { CHANNEL_STRATEGIES } from './notification.constants';

@Module({
  imports: [TypeOrmModule.forFeature([InAppNotification, EmailNotification])],
  providers: [
    InAppChannel,
    EmailChannel,
    {
      provide: CHANNEL_STRATEGIES,
      useFactory: (inApp: InAppChannel, email: EmailChannel) => [inApp, email],
      inject: [InAppChannel, EmailChannel],
    },
    NotificationService,
  ],
  exports: [NotificationService],
})
export class NotificationModule {}
