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

function generateUniqueId() {
    return uuidv4();
}

@Controller('airports')
@ApiTags('Airports')
// @UseGuards(AuthGuard('jwt'), PermissionGuard)

export class IntegrationsController {
    constructor(private readonly rabbitMQService: RabbitMQService) { }
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
            const correlationId = generateUniqueId();
            // Translate the HTTP request into a message
            const message = {
                action: 'find_airports',
                payload: {
                    search,
                    limit
                }
            };

            amqplib.connect(process.env.RABBITMQ_CONECTION_URL, function (error0, connection) {
                if (error0) {
                    throw error0;
                }
                connection.createChannel(function (error1, channel) {
                    if (error1) {
                        throw error1;
                    }
                    channel.assertQueue('', {
                        exclusive: true
                    }, function (error2, q) {
                        if (error2) {
                            throw error2;
                        }

                        channel.consume(q.queue, function (msg) {
                            console.log({ msg });

                            if (msg.properties.correlationId == correlationId) {

                                const jsonString = msg.content.toString();

                                const originalObject = JSON.parse(jsonString);

                                res.status(200).json(originalObject);
                                connection.close();
                            }
                        }, {
                            noAck: true
                        });

                        channel.sendToQueue('find_airports',
                            Buffer.from(JSON.stringify(message)), {
                            correlationId: correlationId,
                            replyTo: q.queue
                        });
                    });
                });
            });
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    @Post('/flight/search')
    @ApiBody({ type: FlightOffersPricingRequestDTO })
    async getFlightPrice(@Body() requestDto: FlightOffersPricingRequestDTO, @Req() req, @Res() res) {

        try {
            
        } catch (error) {
            
        }

    //     try {
    //         const correlationId = generateUniqueId();
    //         // Translate the HTTP request into a message
    //         const message = {
    //             payload: requestDto
    //         };

    //         amqplib.connect(process.env.RABBITMQ_CONECTION_URL, function (error0, connection) {
    //             if (error0) {
    //                 throw error0;
    //             }
    //             connection.createChannel(function (error1, channel) {
    //                 if (error1) {
    //                     throw error1;
    //                 }
    //                 channel.assertQueue('', {
    //                     exclusive: true
    //                 }, function (error2, q) {
    //                     if (error2) {
    //                         throw error2;
    //                     }

    //                     channel.consume(q.queue, function (msg) {

    //                         if (msg.properties.correlationId == correlationId) {

    //                             const jsonString = msg.content.toString();

    //                             const originalObject = JSON.parse(jsonString);

    //                             res.status(200).json(originalObject);
    //                             connection.close();
    //                         }
    //                     }, {
    //                         noAck: true
    //                     });

    //                     channel.sendToQueue('find_flights',
    //                         Buffer.from(JSON.stringify(message)), {
    //                         correlationId: correlationId,
    //                         replyTo: q.queue
    //                     });
    //                 });
    //             });
    //         });
    //     } catch (err) {
    //         console.log(err);
    //         res.status(500).json({ message: 'Internal Server Error' });
    //     }
    }


}

