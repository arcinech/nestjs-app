import { Tags } from '../enums/tags.enums';
import {
  IsNotEmpty,
  IsNumber,
  IsEnum,
  Min,
  MaxLength,
  MinLength,
  IsArray,
} from 'class-validator';

export class UpdateProductDTO {
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(25)
  name: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  price: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  count: number;

  @IsArray()
  @IsEnum(Tags, { each: true })
  tags: Array<Tags>;
}
