// permission-seed.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from 'src/permissions/entities/permission.entity'; // Update the import path

@Injectable()
export class PermissionSeedService {
  constructor(
    @InjectRepository(Permission)
    private repository: Repository<Permission>,
  ) {}

  async run() {
    const countPermissions = await this.repository.count();

    if (!countPermissions) {
      const permissions = [
        { name: 'CREATE_ROLE' },
        { name: 'CREATE_USER' },
        { name: 'ADD_ROLE_TO_USER' },
        { name: 'VIEW_PERMISSIONS' },
        { name: 'VIEW_ROLE' },
        { name: 'ADD_PERMISSIONS_TO_ROLE' },
        { name: 'CREATE_JET' },
        { name: 'UPDATE_JET' },
        { name: 'DELETE_JET' },
        { name: 'GET_ALL_JETS' },
        { name: 'GET_ONE_JET' }
      ];

      await this.repository.save(this.repository.create(permissions));
    }
  }
}
