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
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Permissions } from 'src/permissions/decorators/permission.decorator'
import { AuthGuard } from '@nestjs/passport';
import { Airports } from './dto/airports.dto';

function generateUniqueId() {
    return uuidv4();
}

@Controller('airports')
@ApiTags('Airports')
@UseGuards(AuthGuard('jwt'), PermissionGuard)

export class AirlinesController {
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
        const correlationId = generateUniqueId();

        // Translate the HTTP request into a message
        const message = {
            action: 'find_airports',
            payload: {
                search,
                limit
            },
            correlationId,
        };

        try {
            // Publish the login message to the RabbitMQ queue
            await this.rabbitMQService.publishMessage('integration-queue', message);

            // Listen for the response with the specified correlation ID
            const response = await this.rabbitMQService.waitForResponseWithTimeout(correlationId);

            if (response.action === 'airports_filtered') {
                res.status(200).json({
                    message: 'Airports fetched successfully',
                    data: response.response,
                });
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

