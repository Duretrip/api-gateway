import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class VerifyTransactionDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ example: 123456718 })
  transaction_id: number;
}
