import { Status } from '../enums/status.enums';
import {
  IsNotEmpty,
  IsNumber,
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

export class ExternalOrderDto {
  @IsNotEmpty()
  @IsUUID()
  id: string;

  @IsOptional()
  @IsArray()
  orderItems: ExternalOrderItemDto[];

  @IsNotEmpty()
  @IsEnum(Status, { each: true })
  status: Status;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(1000000)
  @Type(() => Number)
  total: number;

  @IsOptional()
  @MaxLength(255)
  additionalInfo: string;

  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @IsNotEmpty()
  @IsUUID()
  addressId: string;
}

export class ExternalOrderItemDto {
  @IsNotEmpty()
  @IsUUID()
  id: string;

  @IsNotEmpty()
  @IsUUID()
  productId: string;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @Max(100)
  @Type(() => Number)
  quantity: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(1000000)
  @Type(() => Number)
  price: number;
}
