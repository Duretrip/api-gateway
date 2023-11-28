import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { InititatePaymentDto } from './dto/initiate-payment.dto';
// import { RabbitMQService } from 'src/rabbitmq/rabbitmq.service';
// import { v4 as uuidv4 } from 'uuid';
import { VerifyTransactionDto } from './dto/verify-transaction.dto';
import { HttpService } from '@nestjs/axios';
import { AuthGuard } from '@nestjs/passport';

// function generateUniqueId() {
//   return uuidv4();
// }

@Controller('payments')
@ApiTags('Payments')
export class PaymentController {
  paymentUrl: string;
  constructor(
    // private readonly rabbitMQService: RabbitMQService,
    private readonly httpService: HttpService,
  ) {
    this.paymentUrl = String(process.env.PAYMENT_BACKEND_DOMAIN);
  }

  @Post('initiate')
  async initiatePayment(
    @Body() credentials: InititatePaymentDto,
    @Req() req,
    @Res({ passthrough: true }) res,
  ) {
    try {
      const response = await this.httpService.axiosRef.post(
        `${this.paymentUrl}/payments/initiate`,
        credentials,
      );

      res.status(201).json({
        status: true,
        data: response.data,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  @Post('verify-transaction')
  async verifyTransaction(
    @Body() credentials: VerifyTransactionDto,
    @Req() req,
    @Res({ passthrough: true }) res,
  ) {
    try {
      const response = await this.httpService.axiosRef.post(
        `${this.paymentUrl}/payments/verify-transaction`,
        credentials,
      );

      res.status(201).json({
        status: true,
        data: response.data,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  @Post('flw-webhook')
  async webhook(@Req() req, @Res() res) {
    const body = { ...req.body, hash: req.headers['verif-hash'] };
    await this.httpService.axiosRef.post(
      `${this.paymentUrl}/payments/flw-webhook`,
      body,
    );

    try {
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiQuery({ name: 'search', required: false, description: 'Search query' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number', type: Number })
  @ApiQuery({ name: 'pageSize', required: false, description: 'Page size', type: Number })
  @ApiResponse({ status: 201, description: 'Returns the list of payments' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @Get()
  async getAllPayments(
    @Query('search') search: string,
    @Query('page') page = 1,
    @Query('pageSize') pageSize = 10,
    @Res({ passthrough: true }) res,
  ) {
    try {
      const response = await this.httpService.axiosRef.get(
        `${this.paymentUrl}/payments?page=${page}&pageSize=${pageSize}&search=${search}`,
      );

      res.status(201).json({
        status: true,
        data: response.data,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  // @Post('initiate')
  // async initiatePayment(
  //   @Body() credentials: InititatePaymentDto,
  //   @Req() req: Request,
  //   @Res() res: Response,
  // ) {
  //   const correlationId = generateUniqueId();

  //   // Translate the HTTP request into a message
  //   const message = {
  //     action: 'initiate_payment',
  //     payload: credentials,
  //     correlationId,
  //   };

  //   try {
  //     // Publish the initiate_payment message to the RabbitMQ queue
  //     await this.rabbitMQService.publishMessage('payment-queue', message);

  //     // Listen for the response with the specified correlation ID
  //     const response =
  //       await this.rabbitMQService.waitForResponseWithTimeout(correlationId);
  //     if (response.action === 'payment_initiated') {
  //       const { message, statusCode } = response?.response;
  //       res
  //         .status(statusCode ? statusCode : 500)
  //         .send(message ? message : 'Internal Server Error');
  //     } else {
  //       res.status(response.status ? response?.status : 500).json({
  //         message: response.message ? response.message : 'An error occurred',
  //       });
  //     }
  //   } catch (err) {
  //     console.log(err);
  //     res.status(500).json({ message: 'Internal Server Error' });
  //   }
  // }
  // @Post('verify')
  // async verifyTransaction(
  //   @Body() credentials: VerifyTransactionDto,
  //   @Req() req: Request,
  //   @Res() res: Response,
  // ) {
  //   const correlationId = generateUniqueId();

  //   // Translate the HTTP request into a message
  //   const message = {
  //     action: 'verify_transaction',
  //     payload: credentials,
  //     correlationId,
  //   };
  //   try {
  //     // Publish the initiate_payment message to the RabbitMQ queue
  //     await this.rabbitMQService.publishMessage('payment-queue', message);

  //     // Listen for the response with the specified correlation ID
  //     const response =
  //       await this.rabbitMQService.waitForResponseWithTimeout(correlationId);

  //     if (response.action === 'transaction_verified') {
  //       console.log({ response });
  //       const { message, statusCode } = response?.response;
  //       res
  //         .status(statusCode ? statusCode : 500)
  //         .send(message ? message : 'Internal Server Error');
  //     } else {
  //       res.status(response.status ? response?.status : 500).json({
  //         message: response.message ? response.message : 'An error occurred',
  //       });
  //     }
  //   } catch (err) {
  //     console.log(err);
  //     res.status(500).json({ message: 'Internal Server Error' });
  //   }
  // }

  // @Post('flw-webhook')
  // async webhook(@Req() req: Request, @Res() res: Response) {
  //   const correlationId = generateUniqueId();

  //   // Translate the HTTP request into a message
  //   const message = {
  //     action: 'trigger_webhook',
  //     payload: { body: req.body, headers: req.headers['verify-hash'], res },
  //     correlationId,
  //   };
  //   try {
  //     // Publish the initiate_payment message to the RabbitMQ queue
  //     await this.rabbitMQService.publishMessage('payment-queue', message);

  //     // Listen for the response with the specified correlation ID
  //     const response =
  //       await this.rabbitMQService.waitForResponseWithTimeout(correlationId);
  //     const paymentStatus = response.data.status;
  //     if (paymentStatus === 'successfull') {
  //       // Publish the Booking message to the RabbitMQ queue

  //       const bookingMessage = {
  //         action: 'create_booking',
  //         payload: req.body,
  //         correlationId,
  //       };
  //       await this.rabbitMQService.publishMessage(
  //         'booking-queue',
  //         bookingMessage,
  //       );

  //       if (response.action === 'booking_created') {
  //         const { message, statusCode } = response?.response;
  //         res
  //           .status(statusCode ? statusCode : 500)
  //           .send(message ? message : 'Internal Server Error');
  //       } else {
  //         res.status(response.status ? response?.status : 500).json({
  //           message: response.message ? response.message : 'An error occurred',
  //         });
  //       }
  //     }
  //     if (response.action === 'webhook_triggered') {
  //       console.log({ response });
  //       const { message, statusCode } = response?.response;
  //       res
  //         .status(statusCode ? statusCode : 500)
  //         .send(message ? message : 'Internal Server Error');
  //     } else {
  //       res.status(response.status ? response?.status : 500).json({
  //         message: response.message ? response.message : 'An error occurred',
  //       });
  //     }
  //   } catch (err) {
  //     console.log(err);
  //     res.status(500).json({ message: 'Internal Server Error' });
  //   }
  // }
}
