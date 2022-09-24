import { Roles } from '../enums/roles.enums';
import { UserAddress } from '../interfaces/userAddress.interface';

export interface CreateUserDto {
  firstname: string;
  lastname: string;
  email: string;
  birthdate: Date;
  address: Array<UserAddress>;
  role: Roles;
}
