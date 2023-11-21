import { Controller } from '@nestjs/common';
import { RabbitMQService } from 'src/rabbitmq/rabbitmq.service';
import { MailerService } from './mailer.service';

@Controller('mailer')
export class MailerController {
    constructor(
        private readonly rabbitMQService: RabbitMQService,
        private readonly mailerService: MailerService
    ) { }
    async onModuleInit() {
        await this.rabbitMQService.connectToRabbitMQ();
        if (!process.env.RABBITMQ_MAILER_QUEUE) return
        try {
            await this.rabbitMQService.consumeMessages(process.env.RABBITMQ_MAILER_QUEUE, async (message) => {
                // Find All Jets
                if (message.action === 'send_mail') {
                    const { templateContent, context, ...mailOptions } = message.payload;
                    await this.mailerService.sendMail({
                        templateContent,
                        context,
                        ...mailOptions
                    });
                }
            });
        } catch (error) {
            console.log({ error: JSON.stringify(error) });
        }
    }
}
