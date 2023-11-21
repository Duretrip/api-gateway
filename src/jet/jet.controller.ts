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
} from '@nestjs/common';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';
import { v4 as uuidv4 } from 'uuid';
import { PermissionGuard } from 'src/permissions/guards/permission.guard';
import { CreateJetDto } from './dto/create-jet.dto';
import { ApiTags } from '@nestjs/swagger';
import { UpdateJetDto } from './dto/update-jet.dto';
import { Permissions } from 'src/permissions/decorators/permission.decorator';
import { AuthGuard } from '@nestjs/passport';
import { CreateFacilityDto } from './dto/create-facility.dto';
import { UpdateFacilityDto } from './dto/update-facility.dto';
import { UpdateCapacityDto } from './dto/update-capacity.dto';
import { CreateCapacityDto } from './dto/create-capacity.dto';
import { CreateRangeDto } from './dto/create-range.dto';
import { UpdateRangeDto } from './dto/update-range.dto';

function generateUniqueId() {
  return uuidv4();
}

@Controller('jet')
@ApiTags('Jets')
// @UseGuards(AuthGuard('jwt'), PermissionGuard)
// @UseGuards(AuthGuard('jwt'))
export class JetController {
  constructor(private readonly rabbitMQService: RabbitMQService) {}
  @Get()
  async getAllJets(@Body() credentials: any, @Req() req, @Res() res) {
    const correlationId = generateUniqueId();

    // Translate the HTTP request into a message
    const message = {
      action: 'find_all_jet',
      payload: credentials,
      correlationId,
    };

    try {
      // Publish the login message to the RabbitMQ queue
      await this.rabbitMQService.publishMessage('jet-queue', message);

      // Listen for the response with the specified correlation ID
      const response =
        await this.rabbitMQService.waitForResponseWithTimeout(correlationId);

      if (response.action === 'jet_find_all') {
        res.status(200).json({
          message: 'Jets fetched successfully',
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

  // ******* FACILITY APIs
  @Get('facility')
  async getAllFacilities(@Req() req, @Res() res) {
    const correlationId = generateUniqueId();

    // Translate the HTTP request into a message
    const message = {
      action: 'find_all_facility',
      payload: {},
      correlationId,
    };

    try {
      // Publish the login message to the RabbitMQ queue
      await this.rabbitMQService.publishMessage('jet-queue', message);

      // Listen for the response with the specified correlation ID
      const response =
        await this.rabbitMQService.waitForResponseWithTimeout(correlationId);

      if (response.action === 'facility_find_all') {
        res.status(200).json({
          message: 'Facility fetched successfully',
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
  @Get('facility/:id')
  async getOneFaciliy(@Param('id') id: string, @Req() req, @Res() res) {
    const correlationId = generateUniqueId();

    // Translate the HTTP request into a message
    const message = {
      action: 'find_one_facility',
      payload: +id,
      correlationId,
    };

    try {
      // Publish the login message to the RabbitMQ queue
      await this.rabbitMQService.publishMessage('jet-queue', message);

      // Listen for the response with the specified correlation ID
      const response =
        await this.rabbitMQService.waitForResponseWithTimeout(correlationId);

      if (response.action === 'facility_find_one') {
        res.status(200).json({
          message: 'Facility fetched successfully',
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
  @Post('facility')
  async createFaciliy(
    @Body() credentials: CreateFacilityDto,
    @Req() req,
    @Res() res,
  ) {
    const correlationId = generateUniqueId();

    // Translate the HTTP request into a message
    const message = {
      action: 'create_facility',
      payload: credentials,
      correlationId,
    };

    try {
      // Publish the login message to the RabbitMQ queue
      await this.rabbitMQService.publishMessage('jet-queue', message);

      // Listen for the response with the specified correlation ID
      const response =
        await this.rabbitMQService.waitForResponseWithTimeout(correlationId);

      if (response.action === 'facility_created') {
        console.log({ response });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { message, error, statusCode } = response?.response;
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
  @Patch('facility/:id')
  async updateFaciliy(
    @Param('id') id: string,
    @Body() credentials: UpdateFacilityDto,
    @Req() req,
    @Res() res,
  ) {
    const correlationId = generateUniqueId();

    // Translate the HTTP request into a message
    const message = {
      action: 'update_facility',
      payload: { id, credentials },
      correlationId,
    };

    try {
      // Publish the login message to the RabbitMQ queue
      await this.rabbitMQService.publishMessage('jet-queue', message);

      // Listen for the response with the specified correlation ID
      const response =
        await this.rabbitMQService.waitForResponseWithTimeout(correlationId);

      if (response.action === 'facility_updated') {
        res.status(200).json({
          message: 'Facility updated successfully',
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
  @Delete('facility/:id')
  async deleteFaciliy(@Param('id') id: string, @Req() req, @Res() res) {
    const correlationId = generateUniqueId();

    // Translate the HTTP request into a message
    const message = {
      action: 'delete_facility',
      payload: +id,
      correlationId,
    };

    try {
      // Publish the login message to the RabbitMQ queue
      await this.rabbitMQService.publishMessage('jet-queue', message);

      // Listen for the response with the specified correlation ID
      const response =
        await this.rabbitMQService.waitForResponseWithTimeout(correlationId);

      if (response.action === 'facility_deleted') {
        res.status(200).json({
          message: 'Facility deleted successfully',
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

  // ******* CAPICITY APIs
  @Get('capacity')
  async getAllCapacities(@Req() req, @Res() res) {
    const correlationId = generateUniqueId();

    // Translate the HTTP request into a message
    const message = {
      action: 'find_all_capacity',
      payload: {},
      correlationId,
    };

    try {
      // Publish the login message to the RabbitMQ queue
      this.rabbitMQService
        .publishMessage('jet-queue', message)
        .then(() => console.log('sent'))
        .catch(() => console.log('not sent'));

      // Listen for the response with the specified correlation ID
      const response =
        await this.rabbitMQService.waitForResponseWithTimeout(correlationId);

      if (response.action === 'capacity_find_all') {
        res.status(200).json({
          message: 'Capacity fetched successfully',
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

  @Get('capacity/:id')
  async getOneCapacity(@Param('id') id: string, @Req() req, @Res() res) {
    const correlationId = generateUniqueId();

    // Translate the HTTP request into a message
    const message = {
      action: 'find_one_capacity',
      payload: +id,
      correlationId,
    };

    try {
      // Publish the login message to the RabbitMQ queue
      await this.rabbitMQService.publishMessage('jet-queue', message);

      // Listen for the response with the specified correlation ID
      const response =
        await this.rabbitMQService.waitForResponseWithTimeout(correlationId);

      if (response.action === 'capacity_find_one') {
        res.status(200).json({
          message: 'Capacity fetched successfully',
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
  @Post('capacity')
  async createCapacity(
    @Body() credentials: CreateCapacityDto,
    @Req() req,
    @Res() res,
  ) {
    const correlationId = generateUniqueId();

    // Translate the HTTP request into a message
    const message = {
      action: 'create_capacity',
      payload: credentials,
      correlationId,
    };

    try {
      // Publish the login message to the RabbitMQ queue
      await this.rabbitMQService.publishMessage('jet-queue', message);

      // Listen for the response with the specified correlation ID
      const response =
        await this.rabbitMQService.waitForResponseWithTimeout(correlationId);

      if (response.action === 'capacity_created') {
        res.status(200).json({
          message: 'Capacity created successfully',
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
  @Patch('capacity/:id')
  async updateCapacity(
    @Param('id') id: string,
    @Body() credentials: UpdateCapacityDto,
    @Req() req,
    @Res() res,
  ) {
    const correlationId = generateUniqueId();

    // Translate the HTTP request into a message
    const message = {
      action: 'update_capacity',
      payload: { id, credentials },
      correlationId,
    };

    try {
      // Publish the login message to the RabbitMQ queue
      await this.rabbitMQService.publishMessage('jet-queue', message);

      // Listen for the response with the specified correlation ID
      const response =
        await this.rabbitMQService.waitForResponseWithTimeout(correlationId);

      if (response.action === 'capacity_updated') {
        res.status(200).json({
          message: 'Capacity updated successfully',
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
  @Delete('capacity/:id')
  async deleteCapacity(@Param('id') id: string, @Req() req, @Res() res) {
    const correlationId = generateUniqueId();

    // Translate the HTTP request into a message
    const message = {
      action: 'delete_capacity',
      payload: +id,
      correlationId,
    };

    try {
      // Publish the login message to the RabbitMQ queue
      await this.rabbitMQService.publishMessage('jet-queue', message);

      // Listen for the response with the specified correlation ID
      const response =
        await this.rabbitMQService.waitForResponseWithTimeout(correlationId);

      if (response.action === 'capacity_deleted') {
        res.status(200).json({
          message: 'Capacity deleted successfully',
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

  // ******* RANGE APIs
  @Get('range')
  async getAllRanges(@Req() req, @Res() res) {
    const correlationId = generateUniqueId();

    // Translate the HTTP request into a message
    const message = {
      action: 'find_all_range',
      payload: {},
      correlationId,
    };

    try {
      // Publish the login message to the RabbitMQ queue
      await this.rabbitMQService.publishMessage('jet-queue', message);

      // Listen for the response with the specified correlation ID
      const response =
        await this.rabbitMQService.waitForResponseWithTimeout(correlationId);

      if (response.action === 'range_find_all') {
        res.status(200).json({
          message: 'Range fetched successfully',
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
  @Get('range/:id')
  async getOneRange(@Param('id') id: string, @Req() req, @Res() res) {
    const correlationId = generateUniqueId();

    // Translate the HTTP request into a message
    const message = {
      action: 'find_one_range',
      payload: +id,
      correlationId,
    };

    try {
      // Publish the login message to the RabbitMQ queue
      await this.rabbitMQService.publishMessage('jet-queue', message);

      // Listen for the response with the specified correlation ID
      const response =
        await this.rabbitMQService.waitForResponseWithTimeout(correlationId);

      if (response.action === 'range_find_one') {
        res.status(200).json({
          message: 'Range fetched successfully',
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
  @Post('range')
  async createRange(
    @Body() credentials: CreateRangeDto,
    @Req() req,
    @Res() res,
  ) {
    const correlationId = generateUniqueId();

    // Translate the HTTP request into a message
    const message = {
      action: 'create_range',
      payload: credentials,
      correlationId,
    };

    try {
      // Publish the login message to the RabbitMQ queue
      await this.rabbitMQService.publishMessage('jet-queue', message);

      // Listen for the response with the specified correlation ID
      const response =
        await this.rabbitMQService.waitForResponseWithTimeout(correlationId);

      if (response.action === 'range_created') {
        res.status(200).json({
          message: 'Range created successfully',
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
  @Patch('range/:id')
  async updateRange(
    @Param('id') id: string,
    @Body() credentials: UpdateRangeDto,
    @Req() req,
    @Res() res,
  ) {
    const correlationId = generateUniqueId();

    // Translate the HTTP request into a message
    const message = {
      action: 'update_range',
      payload: { id, credentials },
      correlationId,
    };

    try {
      // Publish the login message to the RabbitMQ queue
      await this.rabbitMQService.publishMessage('jet-queue', message);

      // Listen for the response with the specified correlation ID
      const response =
        await this.rabbitMQService.waitForResponseWithTimeout(correlationId);

      if (response.action === 'range_updated') {
        res.status(200).json({
          message: 'Range updated successfully',
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
  @Delete('range/:id')
  async deleteRange(@Param('id') id: string, @Req() req, @Res() res) {
    const correlationId = generateUniqueId();

    // Translate the HTTP request into a message
    const message = {
      action: 'delete_range',
      payload: +id,
      correlationId,
    };

    try {
      // Publish the login message to the RabbitMQ queue
      await this.rabbitMQService.publishMessage('jet-queue', message);

      // Listen for the response with the specified correlation ID
      const response =
        await this.rabbitMQService.waitForResponseWithTimeout(correlationId);

      if (response.action === 'range_deleted') {
        res.status(200).json({
          message: 'Range deleted successfully',
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

  @Permissions('CREATE_JET')
  @Post()
  async createAllJet(
    @Body() credentials: CreateJetDto,
    @Req() req,
    @Res() res,
  ) {
    const correlationId = generateUniqueId();

    // Translate the HTTP request into a message
    const message = {
      action: 'create_jet',
      payload: credentials,
      correlationId,
    };

    try {
      // Publish the login message to the RabbitMQ queue
      await this.rabbitMQService.publishMessage('jet-queue', message);

      // Listen for the response with the specified correlation ID
      const response =
        await this.rabbitMQService.waitForResponseWithTimeout(correlationId);

      if (response.action === 'jet_created') {
        res.status(200).json('Jet created successfully');
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

  @Permissions('UPDATE_JET')
  @Patch(':id')
  async updateJet(
    @Param('id') id: string,
    @Body() credentials: UpdateJetDto,
    @Req() req,
    @Res() res,
  ) {
    const correlationId = generateUniqueId();

    // Translate the HTTP request into a message
    const message = {
      action: 'update_jet',
      payload: { id, credentials },
      correlationId,
    };

    try {
      // Publish the login message to the RabbitMQ queue
      await this.rabbitMQService.publishMessage('jet-queue', message);

      // Listen for the response with the specified correlation ID
      const response =
        await this.rabbitMQService.waitForResponseWithTimeout(correlationId);

      if (response.action === 'jet_updated') {
        res.status(200).json('Jet updated successfully');
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

  @Permissions('DELETE_JET')
  @Delete(':id')
  async deleteJet(@Param('id') id: string, @Req() req, @Res() res) {
    const correlationId = generateUniqueId();

    // Translate the HTTP request into a message
    const message = {
      action: 'delete_jet',
      payload: +id,
      correlationId,
    };

    try {
      // Publish the login message to the RabbitMQ queue
      await this.rabbitMQService.publishMessage('jet-queue', message);

      // Listen for the response with the specified correlation ID
      const response =
        await this.rabbitMQService.waitForResponseWithTimeout(correlationId);

      if (response.action === 'jet_deleted') {
        res.status(200).json('Jet deleted successfully');
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

  @Permissions('GET_ONE_JET')
  @Get(':id')
  async getOneJet(@Param('id') id: string, @Req() req, @Res() res) {
    const correlationId = generateUniqueId();

    // Translate the HTTP request into a message
    const message = {
      action: 'find_one_jet',
      payload: +id,
      correlationId,
    };

    try {
      // Publish the login message to the RabbitMQ queue
      await this.rabbitMQService.publishMessage('jet-queue', message);

      // Listen for the response with the specified correlation ID
      const response =
        await this.rabbitMQService.waitForResponseWithTimeout(correlationId);

      if (response.action === 'jet_find_one') {
        res.status(200).json({
          message: 'Jet fetched successfully',
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
