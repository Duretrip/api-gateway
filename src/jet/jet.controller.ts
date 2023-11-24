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
import { HttpService } from '@nestjs/axios';

function generateUniqueId() {
  return uuidv4();
}

@Controller('jets')
@ApiTags('Jets')
// @UseGuards(AuthGuard('jwt'), PermissionGuard)
// @UseGuards(AuthGuard('jwt'))
export class JetController {
  jetUrl: string;
  constructor(
    private readonly rabbitMQService: RabbitMQService,
    private readonly httpService: HttpService,
  ) {
    this.jetUrl = String(process.env.JET_BACKEND_DOMAIN);
  }
  @Get()
  async getAllJets(@Body() credentials: any, @Req() req, @Res() res) {

    try {
      const response = await this.httpService.axiosRef.get(
        `${this.jetUrl}/jets`,
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

  // ******* FACILITY APIs
  @Get('facility')
  async getAllFacilities(@Req() req, @Res() res) {
    try {
      const response = await this.httpService.axiosRef.get(
        `${this.jetUrl}/facility`,
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
  @Get('facility/:id')
  async getOneFaciliy(@Param('id') id: string, @Req() req, @Res() res) {
    try {
      const response = await this.httpService.axiosRef.get(
        `${this.jetUrl}/facility/${id}`,
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
  @Post('facility')
  async createFaciliy(
    @Body() credentials: CreateFacilityDto,
    @Req() req,
    @Res() res,
  ) {
    try {
      const response = await this.httpService.axiosRef.post(
        `${this.jetUrl}/facility`,
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
  @Patch('facility/:id')
  async updateFaciliy(
    @Param('id') id: string,
    @Body() credentials: UpdateFacilityDto,
    @Req() req,
    @Res() res,
  ) {
    try {
      const response = await this.httpService.axiosRef.patch(
        `${this.jetUrl}/facility/${id}`,
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
  @Delete('facility/:id')
  async deleteFaciliy(@Param('id') id: string, @Req() req, @Res() res) {
    try {
      const response = await this.httpService.axiosRef.delete(
        `${this.jetUrl}/facility/${id}`,
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

  // ******* CAPICITY APIs
  @Get('capacity')
  async getAllCapacities(@Req() req, @Res() res) {
    try {
      const response = await this.httpService.axiosRef.get(
        `${this.jetUrl}/capacity`,
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

  @Get('capacity/:id')
  async getOneCapacity(@Param('id') id: string, @Req() req, @Res() res) {
    try {
      const response = await this.httpService.axiosRef.get(
        `${this.jetUrl}/capacity/${id}`,
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
  @Post('capacity')
  async createCapacity(
    @Body() credentials: CreateCapacityDto,
    @Req() req,
    @Res() res,
  ) {
    try {
      const response = await this.httpService.axiosRef.post(
        `${this.jetUrl}/capacity`,
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
  @Patch('capacity/:id')
  async updateCapacity(
    @Param('id') id: string,
    @Body() credentials: UpdateCapacityDto,
    @Req() req,
    @Res() res,
  ) {
    try {
      const response = await this.httpService.axiosRef.patch(
        `${this.jetUrl}/capacity/${id}`,
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
  @Delete('capacity/:id')
  async deleteCapacity(@Param('id') id: string, @Req() req, @Res() res) {
    try {
      const response = await this.httpService.axiosRef.delete(
        `${this.jetUrl}/capacity/${id}`,
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

  // ******* RANGE APIs
  @Get('range')
  async getAllRanges(@Req() req, @Res() res) {
    try {
      const response = await this.httpService.axiosRef.get(
        `${this.jetUrl}/range`,
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
  @Get('range/:id')
  async getOneRange(@Param('id') id: string, @Req() req, @Res() res) {
    try {
      const response = await this.httpService.axiosRef.get(
        `${this.jetUrl}/range/${id}`,
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
  @Post('range')
  async createRange(
    @Body() credentials: CreateRangeDto,
    @Req() req,
    @Res() res,
  ) {
    try {
      const response = await this.httpService.axiosRef.post(
        `${this.jetUrl}/range`,
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
  @Patch('range/:id')
  async updateRange(
    @Param('id') id: string,
    @Body() credentials: UpdateRangeDto,
    @Req() req,
    @Res() res,
  ) {
    try {
      const response = await this.httpService.axiosRef.patch(
        `${this.jetUrl}/range/${id}`,
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
  @Delete('range/:id')
  async deleteRange(@Param('id') id: string, @Req() req, @Res() res) {
    try {
      const response = await this.httpService.axiosRef.delete(
        `${this.jetUrl}/range/${id}`,
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

  @Permissions('CREATE_JET')
  @Post()
  async createAllJet(
    @Body() credentials: CreateJetDto,
    @Req() req,
    @Res() res,
  ) {
    try {
      const response = await this.httpService.axiosRef.post(
        `${this.jetUrl}/jets`,
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

  @Permissions('UPDATE_JET')
  @Patch(':id')
  async updateJet(
    @Param('id') id: string,
    @Body() credentials: UpdateJetDto,
    @Req() req,
    @Res() res,
  ) {
    try {
      const response = await this.httpService.axiosRef.patch(
        `${this.jetUrl}/jets/${id}`,
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

  @Permissions('DELETE_JET')
  @Delete(':id')
  async deleteJet(@Param('id') id: string, @Req() req, @Res() res) {
    try {
      const response = await this.httpService.axiosRef.delete(
        `${this.jetUrl}/jets/${id}`,
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

  @Permissions('GET_ONE_JET')
  @Get(':id')
  async getOneJet(@Param('id') id: string, @Req() req, @Res() res) {
    try {
      const response = await this.httpService.axiosRef.get(
        `${this.jetUrl}/jets/${id}`,
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
