import { UserAddress } from '../../users/db/userAddress.entity';
import { Status } from '../enums/status.enums';

export class ExternalOrderDto {
  id: string;
  orderItems: ExternalOrderItemDto[];
  status: Status;
  additionalInfo: string;
  userFirstName: string;
  userLastName: string;
  userEmail: string;
  userAddress: UserAddress;
  createdAt: number[];
  updatedAt: number[];
  total: number;
}

export class ExternalOrderItemDto {
  id: string;
  productId: string;
  productName: string;
  price: number;
  quantity: number;
}
