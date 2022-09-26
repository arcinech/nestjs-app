import { Tags } from '../enums/tags.enums';

export interface Product {
  id: string;
  name: string;
  price: number;
  count: number;
  tags: Array<Tags>;
  createdAt: Date;
  updatedAt: Date;
}
