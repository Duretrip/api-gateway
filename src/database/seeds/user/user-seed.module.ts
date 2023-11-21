import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { UserSeedService } from './user-seed.service';
import { RoleService } from 'src/roles/roles.service';
import { RolesModule } from 'src/roles/roles.module';
import { PermissionsModule } from 'src/permissions/permissions.module';
import { Role } from 'src/roles/entities/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role]), RolesModule, PermissionsModule],
  providers: [UserSeedService, RoleService],
  exports: [UserSeedService],
})
export class UserSeedModule {}
