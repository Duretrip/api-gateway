import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AnonymousStrategy } from './strategies/anonymous.strategy';
import { UsersModule } from 'src/users/users.module';
import { ForgotModule } from 'src/forgot/forgot.module';
import { MailModule } from 'src/mail/mail.module';
import { IsExist } from 'src/utils/validators/is-exists.validator';
import { IsNotExist } from 'src/utils/validators/is-not-exists.validator';
import { SessionModule } from 'src/session/session.module';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { RabbitMQService } from 'src/rabbitmq/rabbitmq.service';
import { RoleService } from 'src/roles/roles.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from 'src/roles/entities/role.entity';
import { PermissionsService } from 'src/permissions/permissions.service';
import { Permission } from 'src/permissions/entities/permission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Role, Permission]),
    UsersModule,
    ForgotModule,
    SessionModule,
    PassportModule,
    MailModule,
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [
    IsExist,
    IsNotExist,
    AuthService,
    JwtStrategy,
    JwtRefreshStrategy,
    AnonymousStrategy,
    RabbitMQService,
    RoleService,
    PermissionsService
  ],
  exports: [AuthService],
})
export class AuthModule {}