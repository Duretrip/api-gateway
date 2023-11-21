// roles.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleService } from './roles.service';
import { Role } from './entities/role.entity';
import { Permission } from 'src/permissions/entities/permission.entity';
import { RolesController } from './roles.controller';
import { PermissionsModule } from 'src/permissions/permissions.module';
import { PermissionsService } from 'src/permissions/permissions.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Role, Permission]), // Import the repositories for Role and Permission
    PermissionsModule
  ],
  providers: [RoleService],
  controllers: [RolesController],
  exports: [RoleService], // Export the service if needed in other modules
})
export class RolesModule {}
