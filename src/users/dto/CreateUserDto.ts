import { Roles } from '../enums/roles.enums';
import { UserAddress } from './userAddress.interface';

export interface CreateUserDto {
  firstname: string;
  lastname: string;
  email: string;
  address: Array<UserAddress>;
  role: Roles;
}
