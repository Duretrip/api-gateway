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
  @ApiProperty({
    example: {
      entity_id: 1,
      entity_type: 'hotel',
      user_id: 1,
    },
  })
  meta: {
    entity_id: number;
    entity_type: string;
    user_id: number;
  };

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
