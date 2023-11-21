// role-permission.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Allow, IsNotEmpty } from 'class-validator';

export class RolePermissionDto {
  @ApiProperty({ example: [1, 2], description: 'Array of permission IDs' })
  @Allow()
  @IsNotEmpty()
  permissionIds: number[];
}
