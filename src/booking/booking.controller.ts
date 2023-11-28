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
import { Request, Response } from 'express';
import { HttpService } from '@nestjs/axios';
import { AuthGuard } from '@nestjs/passport';

@Controller('bookings')
@ApiTags('Bookings')
export class BookingController {
  bookingUrl: string;
  constructor(private readonly httpService: HttpService) {
    this.bookingUrl = String(process.env.BOOKING_BACKEND_DOMAIN);
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
  async getAllBookings(
    @Query('search') search: string,
    @Query('page') page = 1,
    @Query('pageSize') pageSize = 10,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {

    try {
      const response = await this.httpService.axiosRef.get(
        `${this.bookingUrl}/bookings?page=${page}&pageSize=${pageSize}${
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
}
