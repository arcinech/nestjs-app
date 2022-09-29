import { Tags } from '../enums/tags.enums';
import {
  IsNotEmpty,
  IsNumber,
  IsEnum,
  IsInt,
  Min,
  MaxLength,
  MinLength,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDTO {
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(25)
  name: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  price: number;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  count: number;

  @IsArray()
  @IsEnum(Tags, { each: true })
  tags: Array<Tags>;
}
