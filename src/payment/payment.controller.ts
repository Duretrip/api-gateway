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
import { VerifyTransactionDto } from './dto/verify-transaction.dto';
import { HttpService } from '@nestjs/axios';
import { AuthGuard } from '@nestjs/passport';
import { VerifyPaymentDto } from './dto/verify-payment.dto';
import { Request } from 'express';
import { PaymentSearchFieldDto } from './dto/payment-search-field.dto';
import { UsersService } from 'src/users/users.service';

@Controller('payments')
@ApiTags('Payments')
export class PaymentController {
  paymentUrl: string;
  constructor(
    private readonly httpService: HttpService,
    private usersService: UsersService,
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
      // Save Payment
      const paymentUrl = `${process.env.PAYMENT_BACKEND_DOMAIN}/payments/save`;
      const paymentData = {
        transactionRef: credentials.tx_ref,
        status: 'not_paid',
        amount: credentials.amount,
        currency: credentials.currency,
        email: credentials.meta.primary_customer?.email,
        fullname: credentials.meta.primary_customer?.fullName || '',
        dateCreated: new Date(),
      };

      await this.httpService.axiosRef.post(paymentUrl, paymentData);

      //Save Booking Record
      const bookingUrl = `${process.env.BOOKING_BACKEND_DOMAIN}/bookings/create`;
      const bookingData = {
        status: 'not_paid',
        transationRef: credentials.tx_ref,
        email: credentials.meta.primary_customer?.email,
        fullname: credentials.meta.primary_customer?.fullName || '',
        paymentMethod: 'flutterwave',
        data: JSON.stringify(credentials.meta),
        entityType: credentials.meta.entity_type,
      };

      await this.httpService.axiosRef.post(bookingUrl, bookingData);

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

  @Post('verify-payment')
  async verifyPayment(
    @Body() credentials: VerifyPaymentDto,
    @Req() req,
    @Res() res,
  ) {
    try {
      const response = await this.httpService.axiosRef.post(
        `${this.paymentUrl}/payments/verify-payment`,
        credentials,
      );
      res.status(201).json({
        status: true,
        data: response.data,
      });
    } catch (err) {
      console.log(err.message);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  @Post('flw-webhook')
  async webhook(@Req() req, @Res() res) {
    console.log('flutterwave called us at the api gateway service');

    const body = { ...req.body, hash: req.headers['verif-hash'] };
    console.log({ APIGATEWAY: body });

    const data = await this.httpService.axiosRef.post(
      `${this.paymentUrl}/payments/flw-webhook`,
      body,
    );

    if (data) {
      res.status(200).end();
    }

    try {
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiQuery({ name: 'search', required: false, description: 'Search query' })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number',
    type: Number,
  })
  @ApiQuery({
    name: 'pageSize',
    required: false,
    description: 'Page size',
    type: Number,
  })
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
        `${this.paymentUrl}/payments?page=${page}&pageSize=${pageSize}${
          search ? `&search=${search}` : ''
        }`,
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

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('by-email')
  async getTransactionsByEmail(
    @Query() searchQuery: PaymentSearchFieldDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res,
  ) {
    try {
      const userReq = req.user as {
        id: number;
        role: any;
        sessionId: number;
        iat: number;
        exp: number;
      };
      const user = await this.usersService.findOne({
        id: userReq.id,
      });

      const payload = {
        ...searchQuery,
        email: user?.email,
      };
      const response = await this.httpService.axiosRef.get(
        `${this.paymentUrl}/payments/by-email
        `,
        { params: payload },
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
}
