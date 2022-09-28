import { Roles } from '../../shared/enums/roles.enums';
import { UserAddress } from '../db/userAddress.entity';

export interface ExternalUserDto {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  birthdate: Array<number>;
  address?: Array<UserAddress>;
  role: Roles;
}
export interface ExternalUserAddressDto {
  street: string;
  city: string;
  country: string;
  buildingNumber: number;
  flatNumber?: number;
}
