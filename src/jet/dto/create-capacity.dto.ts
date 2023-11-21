import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCapacityDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'testing' })
  name: string;
}
