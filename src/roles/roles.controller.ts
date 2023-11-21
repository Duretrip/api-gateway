// roles.controller.ts

import { Controller, Param, Post, Body, Get, Put, Patch, Delete, NotFoundException, UseGuards } from '@nestjs/common';
import { RoleService } from './roles.service';
import { ApiTags, ApiOperation, ApiResponse, ApiNotFoundResponse, ApiParam, ApiBadRequestResponse, ApiBody } from '@nestjs/swagger';
import { Role } from './entities/role.entity';
import { PermissionGuard } from 'src/permissions/guards/permission.guard';
import { Permissions } from 'src/permissions/decorators/permission.decorator'
import { AuthGuard } from '@nestjs/passport';
import { RoleCreateDto } from './dto/role-create.dto';
import { RolePermissionDto } from './dto/role-permission.dto';

@ApiTags('Roles')
@UseGuards(AuthGuard('jwt'), PermissionGuard)
@Controller('roles')
export class RolesController {
  constructor(private readonly roleService: RoleService) { }

  @Permissions('VIEW_ROLE')
  @Get()
  @ApiOperation({ summary: 'Get all roles', description: 'Retrieve a list of all roles with their associated permissions.' })
  @ApiResponse({ status: 200, description: 'Roles fetched successfully', type: Role, isArray: true })
  async findAll(): Promise<Role[]> {
    return await this.roleService.findAll();
  }

  @Permissions('VIEW_ROLE')
  @Get(':id')
  @ApiOperation({ summary: 'Get role by ID', description: 'Retrieve a role by its ID with associated permissions.' })
  @ApiResponse({ status: 200, description: 'Role fetched successfully', type: Role })
  @ApiNotFoundResponse({ description: 'Role not found' })
  @ApiParam({ name: 'id', description: 'Role ID', type: Number })
  async findById(@Param('id') id: number): Promise<Role> {
    const role = await this.roleService.findById(id);
    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
    return role;
  }

  @Permissions('CREATE_ROLE')
  @Post()
  @ApiOperation({ summary: 'Create a new role', description: 'Create a new role' })
  @ApiResponse({ status: 201, description: 'Role created successfully', type: Role })
  @ApiBadRequestResponse({ description: 'Invalid role data' })
  @ApiBody({ type: RoleCreateDto })
  async create(@Body() roleData: RoleCreateDto): Promise<Role> {
    return this.roleService.create(roleData);
  }

  @Permissions('CREATE_ROLE')
  @Put(':id')
  @ApiOperation({ summary: 'Update a role by ID', description: 'Update an existing role by its ID.' })
  @ApiResponse({ status: 200, description: 'Role updated successfully', type: Role })
  @ApiBadRequestResponse({ description: 'Invalid role data' })
  @ApiNotFoundResponse({ description: 'Role not found' })
  @ApiParam({ name: 'id', description: 'Role ID', type: Number })
  @ApiBody({ type: RoleCreateDto })
  async update(@Param('id') id: number, @Body() RoleCreateDto: Role): Promise<Role> {
    return await this.roleService.update(id, RoleCreateDto);
  }

  @Permissions('CREATE_ROLE')
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a role by ID', description: 'Delete an existing role by its ID.' })
  @ApiResponse({ status: 204, description: 'Role deleted successfully' })
  @ApiNotFoundResponse({ description: 'Role not found' })
  @ApiParam({ name: 'id', description: 'Role ID', type: Number })
  async delete(@Param('id') id: number): Promise<void> {
    return await this.roleService.delete(id);
  }

  @Permissions('CREATE_ROLE')
  @Patch(':roleId/add-permissions')
  @ApiOperation({ summary: 'Add permissions to role', description: 'Add permissions to a role.' })
  @ApiBadRequestResponse({ description: 'Role or permissions not found' })
  @ApiParam({ name: 'roleId', description: 'Role ID', type: Number })
  @ApiBody({ type: [Number], description: 'Array of permission IDs' })
  async addPermissionsToRole(@Param('roleId') roleId: number, @Body() permissions: RolePermissionDto ): Promise<Role> {
    const permissionIds = permissions.permissionIds
    return await this.roleService.addPermissionsToRole(roleId, permissionIds);
  }

  @Permissions('CREATE_ROLE')
  @Patch(':roleId/remove-permission/:permissionId')
  @ApiOperation({ summary: 'Remove permission from role', description: 'Remove a permission from a role.' })
  @ApiResponse({ status: 200, description: 'Permission removed successfully', type: Role })
  @ApiBadRequestResponse({ description: 'Role not found' })
  @ApiParam({ name: 'roleId', description: 'Role ID', type: Number })
  @ApiParam({ name: 'permissionId', description: 'Permission ID', type: Number })
  async removePermissionFromRole(@Param('roleId') roleId: number, @Param('permissionId') permissionId: number): Promise<Role> {
    return await this.roleService.removePermissionFromRole(roleId, permissionId);
  }
}
