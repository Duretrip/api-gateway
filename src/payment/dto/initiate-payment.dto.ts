import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsObject, IsString } from 'class-validator';

export class InititatePaymentDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'tx_li_$#%#ng***' })
  tx_ref: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ example: 1000 })
  amount: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'NGN' })
  currency: string;

  @IsObject()
  @IsNotEmpty()
  @ApiProperty()
  meta: any;

  @IsObject()
  @IsNotEmpty()
  @ApiProperty({
    example: {
      email: 'customer@example.com',
      name: 'customer name',
    },
  })
  customer: {
    email: string;
    name: string;
  };

  @IsObject()
  @IsNotEmpty()
  @ApiProperty({
    example: {
      title: 'Hotel Payment',
    },
  })
  customizations: {
    title: string;
  };
}
