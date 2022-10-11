import { Status } from '../enums/status.enums';

export class ExternalOrderDto {
  id: string;
  orderItems: ExternalOrderItemDto[];
  status: Status;
  total: number;
  additionalInfo: string;
  user_firstname: string;
  user_lastname: string;
  user_email: string;
  user_address: string;
}

export class ExternalOrderItemDto {
  id: string;
  productId: string;
  productName: string;
  price: number;
  quantity: number;
}
