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
import { RideRequestDTO } from './dto/ride-request.dto';

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

            if (response.data && response.data !== '') {
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
            if (response.data && response.data !== '') {
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
            if (response.data && response.data !== '') {
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

    // add hotel search
    @Get('/hotels/search/by-city')
    @ApiQuery({ name: 'cityCode', type: String, required: true })
    @ApiQuery({ name: 'radius', type: String, required: true })
    @ApiQuery({ name: 'radiusUnit', type: String, required: true })
    @ApiQuery({ name: 'amenities', type: [String], isArray: true, required: false })
    @ApiQuery({ name: 'ratings', type: [String], isArray: true, required: false })
    @ApiQuery({ name: 'hotelSource', type: [String], isArray: true, required: false })

    async searchHotelsByCity(
        @Query('cityCode') cityCode: string,
        @Query('radius') radius: string,
        @Query('radiusUnit') radiusUnit: string,
        @Query('amenities') amenities: string[],
        @Query('ratings') ratings: string[],
        @Query('hotelSource') hotelSource: string[],
        @Req() req, @Res() res) {
        const encodeQueryParam = (param, value) => (value !== undefined ? `${param}=${encodeURIComponent(value)}` : '');

        // Constructing the query string
        const queryString = [
            encodeQueryParam('cityCode', cityCode),
            encodeQueryParam('radius', radius),
            encodeQueryParam('radiusUnit', radiusUnit),
            encodeQueryParam('amenities', amenities),
            encodeQueryParam('ratings', ratings),
            encodeQueryParam('hotelSource', hotelSource),
        ].filter(Boolean).join('&');

        const apiRequestUrl = `${this.integrationsUrl}/hotels/search/by-city` + (queryString ? `?${queryString}` : '');
        console.log({ apiRequestUrl });

        try {
            const response = await this.httpService.axiosRef.get(apiRequestUrl);
            if (response.data && response.data !== '') {
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

    // add hotel search
    @Get('/hotels/search/by-geocode')
    @ApiQuery({ name: 'latitude', type: Number, required: true })
    @ApiQuery({ name: 'longitude', type: Number, required: true })
    @ApiQuery({ name: 'radius', type: String, required: true })
    @ApiQuery({ name: 'radiusUnit', type: String, required: true })
    @ApiQuery({ name: 'amenities', type: [String], isArray: true, required: false })
    @ApiQuery({ name: 'ratings', type: [String], isArray: true, required: false })
    @ApiQuery({ name: 'hotelSource', type: [String], isArray: true, required: false })

    async searchHotelsByGeoCode(
        @Query('latitude') latitude: number,
        @Query('longitude') longitude: number,
        @Query('radius') radius: string,
        @Query('radiusUnit') radiusUnit: string,
        @Query('amenities') amenities: string[],
        @Query('ratings') ratings: string[],
        @Query('hotelSource') hotelSource: string[],
        @Res() res) {
        const encodeQueryParam = (param, value) => (value !== undefined ? `${param}=${encodeURIComponent(value)}` : '');

        // Constructing the query string
        const queryString = [
            encodeQueryParam('latitude', latitude),
            encodeQueryParam('longitude', longitude),
            encodeQueryParam('radius', radius),
            encodeQueryParam('radiusUnit', radiusUnit),
            encodeQueryParam('amenities', amenities),
            encodeQueryParam('ratings', ratings),
            encodeQueryParam('hotelSource', hotelSource),
        ].filter(Boolean).join('&');

        const apiRequestUrl = `${this.integrationsUrl}/hotels/search/by-geocode` + (queryString ? `?${queryString}` : '');
        console.log({ apiRequestUrl });

        try {
            const response = await this.httpService.axiosRef.get(apiRequestUrl);
            if (response.data && response.data !== '') {
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

    @Get('/hotels/offers')
    @ApiQuery({ name: 'hotelIds', type: [String], required: true })
    @ApiQuery({ name: 'adults', type: Number, required: false })
    @ApiQuery({ name: 'checkInDate', type: String, required: false })
    @ApiQuery({ name: 'checkOutDate', type: String, required: false })
    @ApiQuery({ name: 'countryOfResidence', type: String, required: false })
    @ApiQuery({ name: 'roomQuantity', type: Number, required: false })
    @ApiQuery({ name: 'priceRange', type: String, required: false })
    @ApiQuery({ name: 'currency', type: String, required: false })
    @ApiQuery({ name: 'paymentPolicy', type: String, required: false })
    @ApiQuery({ name: 'boardType', type: String, required: false })

    async getHotelOffers(
        @Query('hotelIds') hotelIds: string[],
        @Query('adults') adults: number,
        @Query('checkInDate') checkInDate: string,
        @Query('checkOutDate') checkOutDate: string,
        @Query('countryOfResidence') countryOfResidence: string,
        @Query('roomQuantity') roomQuantity: number,
        @Query('priceRange') priceRange: string,
        @Query('currency') currency: string,
        @Query('paymentPolicy') paymentPolicy: string,
        @Query('boardType') boardType: string,
        @Res() res) {
        const encodeQueryParam = (param, value) => (value !== undefined ? `${param}=${encodeURIComponent(value)}` : '');

        // Constructing the query string
        const queryString = [
            encodeQueryParam('hotelIds', hotelIds),
            encodeQueryParam('adults', adults),
            encodeQueryParam('checkInDate', checkInDate),
            encodeQueryParam('checkOutDate', checkOutDate),
            encodeQueryParam('countryOfResidence', countryOfResidence),
            encodeQueryParam('roomQuantity', roomQuantity),
            encodeQueryParam('priceRange', priceRange),
            encodeQueryParam('currency', currency),
            encodeQueryParam('paymentPolicy', paymentPolicy),
            encodeQueryParam('boardType', boardType)
        ].filter(Boolean).join('&');

        const apiRequestUrl = `${this.integrationsUrl}/hotels/offers` + (queryString ? `?${queryString}` : '');
        console.log({ apiRequestUrl });

        try {
            const response = await this.httpService.axiosRef.get(apiRequestUrl);
            if (response.data && response.data !== '') {
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

    // add cars search

    @Post('/ride/search')
    @ApiBody({ type: FlightOffersPricingRequestDTO })
    async getRides(@Body() rideRequest: RideRequestDTO, @Req() req, @Res() res) {
        try {
            const response = await this.httpService.axiosRef.post(
                `${this.integrationsUrl}/ride/search`,
                rideRequest,
            );
            if (response.data && response.data !== '') {
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

