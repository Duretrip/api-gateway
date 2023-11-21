import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateFacilityDto {
  @IsString()
  @ApiProperty({ example: 'testing' })
  @IsNotEmpty()
  name: string;

  @IsString()
  @ApiProperty({ example: 'url' })
  @IsNotEmpty()
  url: string;
}
