import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { InititatePaymentDto } from './dto/initiate-payment.dto';
import { RabbitMQService } from 'src/rabbitmq/rabbitmq.service';
import { v4 as uuidv4 } from 'uuid';
import { VerifyTransactionDto } from './dto/verify-transaction.dto';

function generateUniqueId() {
  return uuidv4();
}
@Controller('payments')
@ApiTags('payments')
export class PaymentController {
  constructor(private readonly rabbitMQService: RabbitMQService) {}

  @Post('initiate')
  async initiatePayment(
    @Body() credentials: InititatePaymentDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const correlationId = generateUniqueId();

    // Translate the HTTP request into a message
    const message = {
      action: 'initiate_payment',
      payload: credentials,
      correlationId,
    };
    

    try {
      // Publish the initiate_payment message to the RabbitMQ queue
      await this.rabbitMQService.publishMessage('payment-queue', message);

      // Listen for the response with the specified correlation ID
      const response =
        await this.rabbitMQService.waitForResponseWithTimeout(correlationId);
      if (response.action === 'payment_initiated') {
        const { message, statusCode } = response?.response;
        res
          .status(statusCode ? statusCode : 500)
          .send(message ? message : 'Internal Server Error');
      } else {
        res.status(response.status ? response?.status : 500).json({
          message: response.message ? response.message : 'An error occurred',
        });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
  @Post('verify')
  async verifyTransaction(
    @Body() credentials: VerifyTransactionDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const correlationId = generateUniqueId();

    // Translate the HTTP request into a message
    const message = {
      action: 'verify_transaction',
      payload: credentials,
      correlationId,
    };
    try {
      // Publish the initiate_payment message to the RabbitMQ queue
      await this.rabbitMQService.publishMessage('payment-queue', message);

      // Listen for the response with the specified correlation ID
      const response =
        await this.rabbitMQService.waitForResponseWithTimeout(correlationId);

      if (response.action === 'transaction_verified') {
        console.log({ response });
        const { message, statusCode } = response?.response;
        res
          .status(statusCode ? statusCode : 500)
          .send(message ? message : 'Internal Server Error');
      } else {
        res.status(response.status ? response?.status : 500).json({
          message: response.message ? response.message : 'An error occurred',
        });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  @Post('flw-webhook')
  async webhook(@Req() req: Request, @Res() res: Response) {
    const correlationId = generateUniqueId();

    // Translate the HTTP request into a message
    const message = {
      action: 'trigger_webhook',
      payload: { body: req.body, res },
      correlationId,
    };
    try {
      // Publish the initiate_payment message to the RabbitMQ queue
      await this.rabbitMQService.publishMessage('payment-queue', message);

      // Listen for the response with the specified correlation ID
      const response =
        await this.rabbitMQService.waitForResponseWithTimeout(correlationId);
      const paymentStatus = response.data.status;
      if (paymentStatus === 'successfull') {
        // Publish the Booking message to the RabbitMQ queue
      //   const bookingMessage = {
      //     action: 'create_booking',
      //     payload: { req, res },
      //     correlationId,
      //   };
      //   await this.rabbitMQService.publishMessage(
      //     'booking-queue',
      //     bookingMessage,
      //   );
      }
      if (response.action === 'webhook_triggered') {
        console.log({ response });
        const { message, statusCode } = response?.response;
        res
          .status(statusCode ? statusCode : 500)
          .send(message ? message : 'Internal Server Error');
      } else {
        res.status(response.status ? response?.status : 500).json({
          message: response.message ? response.message : 'An error occurred',
        });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
}
