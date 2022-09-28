import { Roles } from '../../shared/enums/roles.enums';
import { UserAddress } from './userAddress.interface';

export interface User {
  id?: string;
  firstname: string;
  lastname: string;
  email: string;
  birthdate: Date;
  address?: Array<UserAddress>;
  role: Roles;
}
