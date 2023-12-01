import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class SavePaymentDto {
  @IsString()
  @IsNotEmpty()
  transactionRef: string;

  @IsString()
  @IsNotEmpty()
  status: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  currency: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  fullname: string;

  @IsString()
  @IsNotEmpty()
  dateCreated: string;
}
