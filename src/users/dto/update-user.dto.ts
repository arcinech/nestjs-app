import { Roles } from '../enums/roles.enums';
import { UserAddress } from '../interfaces/userAddress.interface';

export interface UpdateUserDto {
  firstname: string;
  lastname: string;
  email: string;
  birthdate: Array<number>;
  address: Array<UserAddress>;
  role: Roles;
}

export interface UpdateUserAddressDto {
  street: string;
  city: string;
  country: string;
  buldingNumber: number;
  flatNumber?: number;
}
