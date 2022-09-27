import { Roles } from '../../shared/enums/roles.enums';
import { Transform, Type } from 'class-transformer';
import { arrayToDate } from '../../shared/helpers/date.helper';
import {
  IsEmail,
  IsNotEmpty,
  ValidateNested,
  IsNumber,
  IsEnum,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  firstname: string;
  @IsNotEmpty()
  lastname: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Transform((data) => arrayToDate(data.value))
  birthdate: Date;

  @ValidateNested({ each: true })
  @Type(() => CreateUserAddressDto)
  address?: Array<CreateUserAddressDto>;
  @IsEnum(Roles)
  role: Roles;
}

export class CreateUserAddressDto {
  @IsNotEmpty()
  country: string;

  @IsNotEmpty()
  city: string;

  @IsNotEmpty()
  street: string;

  @IsNotEmpty()
  @IsNumber()
  buldingNumber: number;

  @IsNumber()
  flatNumber?: number;
}
