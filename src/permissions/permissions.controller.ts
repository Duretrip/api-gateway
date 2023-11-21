// permission.controller.ts
import { Controller, Get, Post, Put, Delete, Param, Body, NotFoundException, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiNotFoundResponse, ApiParam, ApiBadRequestResponse, ApiBody } from '@nestjs/swagger';
import { Permission } from './entities/permission.entity';
import { PermissionsService } from './permissions.service';
import { PermissionGuard } from './guards/permission.guard';
import {Permissions} from 'src/permissions/decorators/permission.decorator'
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Permissions')
@UseGuards(AuthGuard('jwt'), PermissionGuard) 
@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionService: PermissionsService) {}

  @Permissions('VIEW_PERMISSIONS')
  @Get()
  @ApiOperation({ summary: 'Get all permissions', description: 'Retrieve a list of all permissions.' })
  @ApiResponse({ status: 200, description: 'Permissions fetched successfully', type: Permission, isArray: true })
  async findAll(): Promise<Permission[]> {
    return this.permissionService.findAll();
  }

  @Permissions('VIEW_PERMISSIONS')
  @Get(':id')
  @ApiOperation({ summary: 'Get permission by ID', description: 'Retrieve a permission by its ID.' })
  @ApiResponse({ status: 200, description: 'Permission fetched successfully', type: Permission })
  @ApiNotFoundResponse({ description: 'Permission not found' })
  @ApiParam({ name: 'id', description: 'Permission ID', type: Number })
  async findById(@Param('id') id: number): Promise<Permission> {
    return this.permissionService.findById(id);
  }

  // @Post()
  // @ApiOperation({ summary: 'Create a new permission', description: 'Create a new permission.' })
  // @ApiResponse({ status: 201, description: 'Permission created successfully', type: Permission })
  // @ApiBadRequestResponse({ description: 'Invalid permission data' })
  // @ApiBody({ type: Permission })
  // async create(@Body() permissionData: Permission): Promise<Permission> {
  //   return this.permissionService.create(permissionData);
  // }

  // @Put(':id')
  // @ApiOperation({ summary: 'Update a permission by ID', description: 'Update an existing permission by its ID.' })
  // @ApiResponse({ status: 200, description: 'Permission updated successfully', type: Permission })
  // @ApiBadRequestResponse({ description: 'Invalid permission data' })
  // @ApiNotFoundResponse({ description: 'Permission not found' })
  // @ApiParam({ name: 'id', description: 'Permission ID', type: Number })
  // @ApiBody({ type: Permission })
  // async update(@Param('id') id: number, @Body() permissionData: Permission): Promise<Permission> {
  //   return this.permissionService.update(id, permissionData);
  // }

  // @Delete(':id')
  // @ApiOperation({ summary: 'Delete a permission by ID', description: 'Delete an existing permission by its ID.' })
  // @ApiResponse({ status: 204, description: 'Permission deleted successfully' })
  // @ApiNotFoundResponse({ description: 'Permission not found' })
  // @ApiParam({ name: 'id', description: 'Permission ID', type: Number })
  // async delete(@Param('id') id: number): Promise<void> {
  //   return this.permissionService.delete(id);
  // }
}
