import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRangeDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'testing' })
  name: string;
}
