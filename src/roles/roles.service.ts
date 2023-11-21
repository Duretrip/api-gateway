// role.service.ts

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getManager } from 'typeorm';
import { Role } from './entities/role.entity';
import { PermissionsService } from 'src/permissions/permissions.service';
import { RoleCreateDto } from './dto/role-create.dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly permissionsService: PermissionsService, // Add PermissionService
  ) { }

  async findAll(): Promise<Role[]> {
    return await this.roleRepository.find({ relations: ['permissions'] });
  }

  async findById(id: number): Promise<Role | undefined> {
    const role = await this.roleRepository.find({
      where: { id },
      relations: ['permissions']
    });

    if (!role || role.length === 0) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    // Assuming you only expect one role, you might want to return the first element
    return role[0];
  }

  async findByName(name: string): Promise<Role | undefined> {
    const role = await this.roleRepository.find({
      where: { name },
      relations: ['permissions']
    });

    if (!role || role.length === 0) {
      throw new NotFoundException(`Role with ID ${name} not found`);
    }

    // Assuming you only expect one role, you might want to return the first element
    return role[0];
  }

  async create(roleData: RoleCreateDto): Promise<Role> {
    const role = this.roleRepository.create(roleData);
    return await this.roleRepository.save(role);
  }

  async update(id: number, roleData: RoleCreateDto): Promise<Role> {
    const existingRole = await this.findById(id); // Check if role exists

    if (!existingRole) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    await this.roleRepository.update(id, roleData);
    return existingRole;
  }

  async delete(id: number): Promise<void> {
    const role = await this.findById(id);
    if (role) {
      await this.roleRepository.remove(role);
    }
  }

  async addPermissionsToRole(roleId: number, permissionIds: number[]): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: {
        id: roleId
      }
    });
  
    if (!role) {
      throw new NotFoundException('Role not found');
    }
  
    if (!Array.isArray(permissionIds)) {
      throw new BadRequestException('Invalid format for permissionIds. Expected an array.');
    }
  
    const permissions = await Promise.all(permissionIds.map(permissionId => this.permissionsService.findById(permissionId)));
  
    if (permissions.some(permission => !permission)) {
      throw new NotFoundException('One or more permissions not found');
    }
  
    role.permissions = role.permissions ? [...role.permissions, ...permissions] : permissions;
    return await this.roleRepository.save(role);
  }
  

  async removePermissionFromRole(roleId: number, permissionId: number): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: {
        id: roleId
      },
      relations: ['permissions']
    });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    role.permissions = role.permissions ? role.permissions.filter((p) => p.id !== permissionId) : [];
    return await this.roleRepository.save(role);
  }
}
