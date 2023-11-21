import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export enum StatusEnum {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export enum AvailabilityEnum {
  AVAILABLE = 'available',
  UAVAILABLE = 'unavailable',
  HIRED = 'hired',
}

export class CreateJetDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Gulfstream G650' })
  model: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example:
      'The Gulfstream G650, often hailed as the epitome of luxury and performance in the world of business',
  })
  description: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '12' })
  availableHours: string;

  @IsNotEmpty()
  @ApiProperty({ example: '23273273' })
  registrationNumber: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Lagos' })
  currentLocation: string;

  @IsArray()
  @IsNotEmpty()
  @ApiProperty({ example: [1, 2, 3] })
  capacities: number[];

  @IsArray()
  @IsNotEmpty()
  @ApiProperty({ example: [1, 2, 3] })
  ranges: number[];

  @IsArray()
  @IsNotEmpty()
  @ApiProperty({ example: [1, 2, 3] })
  facilities: number[];

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ example: 3000 })
  price: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'per day' })
  priceDescription: string;

  @IsArray()
  @IsOptional()
  @ApiProperty({ example: ['url', 'url'] })
  pictures: string[];

  @IsNumber()
  @ApiProperty({ example: 1 })
  userId?: number;
}
