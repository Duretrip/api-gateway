// permission.guard.ts
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) { }

  canActivate(context: ExecutionContext): boolean {
    const requiredPermission = this.reflector.get<string>('permission', context.getHandler());

    if (!requiredPermission) {
      return true; // No permission required
    }

    const request = context.switchToHttp().getRequest();
    const user: User = request.user;

    if (!user || !user.role || !user.role.permissions || !user.role.permissions.some((userPermission) =>
      userPermission.name === requiredPermission,
    )) {
      return false; // User or user's role does not have the required permission
    }

    return true;
  }
}
