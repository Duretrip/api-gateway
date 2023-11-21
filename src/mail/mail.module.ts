import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MailService } from './mail.service';
import { MailerModule } from 'src/mailer/mailer.module';
import { MailController } from './mail.controller';
import { RabbitMQService } from 'src/rabbitmq/rabbitmq.service';

@Module({
  imports: [ConfigModule, MailerModule],
  providers: [MailService, RabbitMQService],
  exports: [MailService],
  controllers: [MailController],
})
export class MailModule {}
