import { Controller, OnModuleInit } from '@nestjs/common';
import { RabbitMQService } from 'src/rabbitmq/rabbitmq.service';
import { MailerService } from './mailer.service';
const amqplib = require('amqplib/callback_api');

@Controller('mailer')
export class MailerController implements OnModuleInit {
    constructor(
        private readonly mailerService: MailerService
    ) { }

    async onModuleInit() {
        try {
            amqplib.connect(process.env.RABBITMQ_CONECTION_URL, (error0, connection) => {
                if (error0) {
                    throw error0;
                }

                connection.createChannel((error1, channel) => {
                    if (error1) {
                        throw error1;
                    }
                    var queue = process.env.RABBITMQ_MAILER_QUEUE;

                    channel.assertQueue(queue, {
                        durable: false
                    });
                    channel.prefetch(1);
                    console.log(' [x] Awaiting Email requests on RabbitMQ');
                    channel.consume(queue, async (msg) => {
                        // Convert buffer to a string
                        const jsonString = msg.content.toString();

                        const originalObject = JSON.parse(jsonString);

                        const { templateContent, context, ...mailOptions } = originalObject.payload;
                        await this.mailerService.sendMail({
                            templateContent,
                            context,
                            ...mailOptions
                        });

                        // use this if you intend to return a response as in RPC
                        //           await channel.sendToQueue(msg.properties.replyTo, Buffer.from(JSON.stringify(response)), {
                        //             correlationId: msg.properties.correlationId
                        //           })

                        channel.ack(msg);
                    });
                });
            });
        } catch (error) {
            console.error(error);
        }
    }
}
