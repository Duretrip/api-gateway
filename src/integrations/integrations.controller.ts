import {
    Controller,
    Post,
    Body,
    Req,
    Res,
    UseGuards,
    Get,
    Param,
    Patch,
    Delete,
    Query,
} from '@nestjs/common';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';
import { v4 as uuidv4 } from 'uuid';
import { PermissionGuard } from 'src/permissions/guards/permission.guard';
import { ApiBody, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Permissions } from 'src/permissions/decorators/permission.decorator'
import { AuthGuard } from '@nestjs/passport';
import { Airports } from './dto/airports.dto';
import { FlightOffersPricingRequestDTO } from './dto/flight-price-request.dto';
const amqplib = require('amqplib/callback_api');
import { HttpService } from '@nestjs/axios';
import BookingRequestDto from './dto/create-booking.dto';
import { FlightRequestDTO } from './dto/flights.dto';

function generateUniqueId() {
    return uuidv4();
}

@Controller('airports')
@ApiTags('Airports')
// @UseGuards(AuthGuard('jwt'), PermissionGuard)

export class IntegrationsController {
    integrationsUrl: string;
    constructor(
        private readonly httpService: HttpService
    ) {
        this.integrationsUrl = String(process.env.INTEGRATIONS_BACKEND_DOMAIN);
    }
    @Get()
    @ApiQuery({
        name: 'search',
        type: String,
        description: 'Search term for filtering airports',
        required: false,
    })
    @ApiQuery({
        name: 'limit',
        type: Number,
        description: 'Limit the number of results',
        required: false,
    })
    @ApiResponse({ status: 200, description: 'Airports fetched successfully' })
    @ApiResponse({ status: 500, description: 'An error occurred' })
    async getAirports(@Query('search') search: string, @Query('limit') limit: number, @Req() req, @Res() res) {
        try {
            const response = await this.httpService.axiosRef.get(
                `${this.integrationsUrl}/airports?search=${search}&${limit ?? `limit=${limit}`}`
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

    @Post('/flight/search')
    @ApiBody({ type: FlightRequestDTO })
    async searchFlights(
        @Body() requestDto,
        @Req() req,
        @Res() res) {

        try {
            const response = await this.httpService.axiosRef.post(
                `${this.integrationsUrl}/flight/search`,
                requestDto,
            );
            if (response.data) {
                res.status(201).json({
                    status: true,
                    data: response.data,
                });
            } else {
                res.status(500).json({ message: 'Unable to fetch data' });
            }
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    @Post('/flight/offer/price')
    @ApiBody({ type: FlightOffersPricingRequestDTO })
    async getFlightPrice(@Body() requestDto, @Req() req, @Res() res) {

        try {
            const response = await this.httpService.axiosRef.post(
                `${this.integrationsUrl}/flight/price`,
                requestDto,
            );
            if (response.data) {
                res.status(201).json({
                    status: true,
                    data: response.data,
                });
            } else {
                res.status(500).json({ message: 'Unable to fetch data' });
            }
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    @Post('/flight/order')
    @ApiBody({ type: BookingRequestDto })
    async createOrder(@Body() requestDto: BookingRequestDto, @Req() req, @Res() res) {
        try {
            const response = await this.httpService.axiosRef.post(
                `${this.integrationsUrl}/flight/order`,
                requestDto,
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

