import { Module } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { MailerController } from './mailer.controller';
import { RabbitMQService } from 'src/rabbitmq/rabbitmq.service';

@Module({
  providers: [MailerService, RabbitMQService],
  exports: [MailerService],
  controllers: [MailerController],
})
export class MailerModule {}
