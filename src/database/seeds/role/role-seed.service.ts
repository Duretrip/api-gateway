import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from 'src/permissions/entities/permission.entity';
import { Role } from 'src/roles/entities/role.entity';
import { RoleEnum } from 'src/roles/roles.enum';
import { DeepPartial, In, Repository } from 'typeorm';

@Injectable()
export class RoleSeedService {
  constructor(
    @InjectRepository(Role)
    private repository: Repository<Role>,
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
  ) { }

  async run() {
    // Check if the permissions exist
    const CREATE_ROLE = await this.permissionRepository.findOne({ where: { name: 'CREATE_ROLE' } });
    const CREATE_USER = await this.permissionRepository.findOne({ where: { name: 'CREATE_USER' } });
    const ADD_ROLE_TO_USER = await this.permissionRepository.findOne({ where: { name: 'ADD_ROLE_TO_USER' } });
    const ADD_PERMISSIONS_TO_ROLE = await this.permissionRepository.findOne({ where: { name: 'ADD_PERMISSIONS_TO_ROLE' } });
    const VIEW_ROLE = await this.permissionRepository.findOne({ where: { name: 'VIEW_ROLE' } });
    const VIEW_PERMISSIONS = await this.permissionRepository.findOne({ where: { name: 'VIEW_PERMISSIONS' } });
    // Create permissions if they don't exist
    if (!CREATE_ROLE) {
      await this.permissionRepository.save(
        this.permissionRepository.create({
          name: 'CREATE_ROLE',
        }),
      );
    }

    if (!CREATE_USER) {
      await this.permissionRepository.save(
        this.permissionRepository.create({
          name: 'CREATE_USER',
        }),
      );
    }

    if (!ADD_ROLE_TO_USER) {
      await this.permissionRepository.save(
        this.permissionRepository.create({
          name: 'ADD_ROLE_TO_USER',
        }),
      );
    }

    if (!ADD_PERMISSIONS_TO_ROLE) {
      await this.permissionRepository.save(
        this.permissionRepository.create({
          name: 'ADD_PERMISSIONS_TO_ROLE',
        }),
      );
    }

    if (!VIEW_ROLE) {
      await this.permissionRepository.save(
        this.permissionRepository.create({
          name: 'VIEW_ROLE',
        }),
      );
    }

    if (!VIEW_PERMISSIONS) {
      await this.permissionRepository.save(
        this.permissionRepository.create({
          name: 'VIEW_PERMISSIONS',
        }),
      );
    }

    const countAdmin = await this.repository.count({
      where: {
        name: RoleEnum.super_admin,
      },
    });

    if (!countAdmin) {
      // Create Admin role without permissions
      const adminRole = this.repository.create({
        // id: RoleEnum.super_admin,
        name: 'Super Admin',
      });

      // Save Admin role without permissions
      const savedAdminRole = await this.repository.save(adminRole);

      // Assign permissions to the Admin role
      const permissions = await this.permissionRepository.find({
        where: { name: In(['CREATE_ROLE', 'CREATE_USER', 'VIEW_ROLE', 'ADD_ROLE_TO_USER', 'ADD_PERMISSIONS_TO_ROLE', 'VIEW_PERMISSIONS']) },
      });

      savedAdminRole.permissions = permissions;
      // Save the Admin role with assigned permissions
      await this.repository.save(savedAdminRole);
    }


    const countUser = await this.repository.count({
      where: {
        name: RoleEnum.user,
      },
    });

    if (!countUser) {
      await this.repository.save(
        this.repository.create({
          // id: RoleEnum.user,
          name: 'User',
        }),
      );
    }
  }
}
