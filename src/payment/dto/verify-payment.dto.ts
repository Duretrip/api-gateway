import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyPaymentDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'tx_li_$#%#ng***' })
  tx_ref: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'successful' })
  status: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '2335262' })
  transaction_id: string;
}
