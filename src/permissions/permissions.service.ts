// permission.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from './entities/permission.entity';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  async findAll(): Promise<Permission[]> {
    return this.permissionRepository.find();
  }

  async findById(id: number): Promise<Permission> {
    const permission = await this.permissionRepository.findOne({
      where:{
        id
      }
    });
    if (!permission) {
      throw new NotFoundException(`Permission with ID ${id} not found`);
    }
    return permission;
  }

  // async create(permissionData: Permission): Promise<Permission> {
  //   const newPermission = this.permissionRepository.create(permissionData);
  //   return this.permissionRepository.save(newPermission);
  // }

  // async update(id: number, permissionData: Permission): Promise<Permission> {
  //   await this.findById(id); // Check if permission exists
  //   await this.permissionRepository.update(id, permissionData);
  //   return this.findById(id);
  // }

  // async delete(id: number): Promise<void> {
  //   const permission = await this.findById(id); // Check if permission exists
  //   await this.permissionRepository.remove(permission);
  // }
}
