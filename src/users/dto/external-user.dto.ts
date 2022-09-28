import { Roles } from '../../shared/enums/roles.enums';
import { UserAddress } from '../interfaces/userAddress.interface';

export interface ExternalUserDto {
  id?: string;
  firstname: string;
  lastname: string;
  email: string;
  birthdate: Array<number>;
  address?: Array<UserAddress>;
  role: Roles;
}
export interface ExternalUserAddressDto {
  street: string;
  city: string;
  country: string;
  buldingNumber: number;
  flatNumber?: number;
}
