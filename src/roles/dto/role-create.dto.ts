// role-id.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Allow, IsString, IsNotEmpty } from 'class-validator';

export class RoleCreateDto {
  @ApiProperty({ example: 'Admin' })
  @Allow()
  @IsString()
  @IsNotEmpty()
  name: string;
}
