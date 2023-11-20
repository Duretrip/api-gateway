/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/require-await */
// rabbitmq.service.ts

import { Injectable } from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitMQService {
  private connection: amqp.Connection;
  private channel: amqp.Channel;

  constructor() {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.connectToRabbitMQ();
  }

  public async connectToRabbitMQ() {
    this.connection = await amqp.connect(
      String(process.env.RABBITMQ_CONECTION_URL),
    ); // Replace with your RabbitMQ server URL
    this.channel = await this.connection.createChannel();
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async publishMessage(queueName: string, message: any) {
    this.channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));
  }

  async consumeMessages(queueName: string, callback: (message: any) => void) {
    this.channel.consume(queueName, (msg) => {
      const message = JSON.parse(msg!.content.toString());
      callback(message);
      this.channel.ack(msg!);
    });
  }

  // async waitForResponse(correlationId: string): Promise<any> {
  //   return new Promise(async (resolve) => {
  //     let consumerTag; // Declare consumerTag outside the callback

  //     // Create a new consumer for each request
  //     // eslint-disable-next-line prefer-const
  //     ({ consumerTag } = await this.channel.consume(
  //       String(process.env.RABBITMQ_API_GATEWAY_QUEUE),
  //       (msg) => {
  //         const message = JSON.parse(msg!.content.toString());
  //         if (message.correlationId === correlationId) {
  //           resolve(message);

  //           // Acknowledge the message
  //           this.channel.ack(msg!);

  //           // Cancel the consumer after resolving the message
  //           this.channel.cancel(consumerTag);
  //         }
  //       },
  //     ));
  //   });
  // }

  async waitForResponse(correlationId: string): Promise<any> {
    return new Promise(async (resolve) => {
      // Create a new consumer for each request
      const { consumerTag } = await this.channel.consume(
        'api-gateway-queue',
        (msg) => {
          if (msg) {
            const message = JSON.parse(msg.content.toString());
            if (message.correlationId === correlationId) {
              resolve(message);

              // Acknowledge the message
              this.channel.ack(msg);

              // Cancel the consumer after resolving the message
              this.channel.cancel(consumerTag);
            }
          }
        },
      );
    });
  }

  public async waitForResponseWithTimeout(correlationId: string): Promise<any> {
    const RESPONSE_TIMEOUT = 5000; // Timeout in milliseconds (adjust as needed)

    return Promise.race([
      this.waitForResponse(correlationId),
      new Promise((_, reject) =>
        setTimeout(
          () => reject('Timeout waiting for response'),
          RESPONSE_TIMEOUT,
        ),
      ),
    ]);
  }
}
