// rabbitmq.service.ts

import { Injectable } from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitMQService {
  private connection: amqp.Connection;
  private channel: amqp.Channel;

  constructor() {
    this.connectToRabbitMQ();
  }

  public async connectToRabbitMQ() {
    this.connection = await amqp.connect(process.env.RABBITMQ_CONECTION_URL); // Replace with your RabbitMQ server URL
    this.channel = await this.connection.createChannel();
  }

  async publishMessage(queueName: string, message: any) {
    this.channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));
  }

  async consumeMessages(queueName: string, callback: (message: any) => void) {
    this.channel.consume(queueName, (msg) => {
      const message = JSON.parse(msg.content.toString());
      callback(message);
      this.channel.ack(msg);
    });
  }

  async waitForResponse(correlationId: string): Promise<any> {
    return new Promise(async (resolve) => {
      let consumerTag; // Declare consumerTag outside the callback

      // Create a new consumer for each request
      ({ consumerTag } = await this.channel.consume(
        process.env.RABBITMQ_API_GATEWAY_QUEUE,
        (msg) => {
          const message = JSON.parse(msg.content.toString());
          if (message.correlationId === correlationId) {
            resolve(message);

            // Acknowledge the message
            this.channel.ack(msg);

            // Cancel the consumer after resolving the message
            this.channel.cancel(consumerTag);
          }
        },
      ));
    });
  }

  public async waitForResponseWithTimeout(
    correlationId: string,
  ): Promise<any> {
    const RESPONSE_TIMEOUT = 5000; // Timeout in milliseconds (adjust as needed)

    return Promise.race([
      this.waitForResponse(correlationId),
      new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error('Timeout waiting for response')),
          RESPONSE_TIMEOUT,
        ),
      ),
    ]);
  }
}
