import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyTransactionDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '123456718' })
  transaction_id: string;
}
