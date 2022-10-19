import { Status } from '../enums/status.enums';
import {
  IsNotEmpty,
  IsEnum,
  IsInt,
  Min,
  MaxLength,
  IsArray,
  IsUUID,
  IsOptional,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrderDto {
  @IsOptional()
  @MaxLength(255)
  additionalInfo: string;

  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @IsNotEmpty()
  @IsUUID()
  addressId: string;

  @IsOptional()
  @IsArray()
  orderItems: CreateOrderItemDto[];
}

export class CreateOrderItemDto {
  @IsNotEmpty()
  @IsUUID()
  productId: string;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @Max(100)
  @Type(() => Number)
  quantity: number;
}
