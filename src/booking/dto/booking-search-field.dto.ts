import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, Min, ValidateIf } from 'class-validator';
import { Transform } from 'class-transformer';

export class BookingSearchFieldDto {
  @ApiPropertyOptional()
  @ValidateIf((object, value) => value)
  @IsString()
  search: string;

  @ApiPropertyOptional({
    default: 1,
  })
  @ValidateIf((object, value) => value)
  @Transform(({ value }) => Number.parseInt(value), {
    toClassOnly: true,
  })
  @Min(1, {
    message: 'minimum page must be 1',
  })
  page: number;

  @ApiPropertyOptional({
    default: 10,
  })
  @ValidateIf((object, value) => value)
  @Transform(({ value }) => Number.parseInt(value), {
    toClassOnly: true,
  })
  @Min(1, {
    message: 'minimum page size must be 1',
  })
  pageSize: number;

  email?: string;
}
