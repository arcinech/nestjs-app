import { Roles } from '../../shared/enums/roles.enums';
import { Transform, Type } from 'class-transformer';
import { arrayToDate } from '../../shared/helpers/date.helper';
import {
  IsEmail,
  IsNotEmpty,
  ValidateNested,
  IsEnum,
  IsInt,
  IsOptional,
} from 'class-validator';

export class UpdateUserDto {
  @IsNotEmpty()
  firstName: string;
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Transform((data) => arrayToDate(data.value))
  birthdate: Date;

  @ValidateNested({ each: true })
  @Type(() => UpdateUserAddressDto)
  address?: Array<UpdateUserAddressDto>;
  @IsEnum(Roles)
  role: Roles;
}

export class UpdateUserAddressDto {
  @IsNotEmpty()
  country: string;

  @IsNotEmpty()
  city: string;

  @IsNotEmpty()
  street: string;

  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  buildingNumber: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  flatNumber?: number;
}
