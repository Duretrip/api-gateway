import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { RabbitMQService } from 'src/rabbitmq/rabbitmq.service';
import path from 'path';
import fs from 'node:fs/promises';

@Controller('mail')
export class MailController {
    constructor(
        private readonly rabbitMQService: RabbitMQService,
    ) { }

    @Post()
    async sendEmail(@Res() res): Promise<void> {
        if (!process.env.RABBITMQ_MAILER_QUEUE) return
        // Translate the HTTP request into a message
        const templatePath = path.join(process.env.PWD || process.cwd(),
            'src',
            'mail',
            'mail-templates',
            'reset-password.hbs',
        )
        const templateContent = await fs.readFile(templatePath, 'utf-8');

        const message = {
            action: 'send_mail',
            payload: {
                to: 'ademesodamilare@gmail.com',
                subject: 'I am sending this email because I love you',
                text: process.env.FRONTEND_DOMAIN,
                templateContent,
                context: {
                    title: 'Do you love me',
                    url: `${process.env.FRONTEND_DOMAIN}/password-change?hash=replacingtheurltextinthetemplate`,
                    actionTitle: 'God is good',
                    app_name: 'DureTrip',
                    text1: 'I am to replace text one in the template',
                    text2: 'I am to replace text two in the template',
                    text3: 'I am to replace text three in the template',
                    text4: 'I am to replace text four in the template',
                },
            },
        };
        try {
            // Publish the login message to the RabbitMQ queue
            this.rabbitMQService
                .publishMessage(process.env.RABBITMQ_MAILER_QUEUE, message)
                .then(() => console.log('email sent'))
                .catch(() => console.log('email not sent'));
                res.status(200).send('Hello World')

        } catch (err) {
            console.log(err);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}



