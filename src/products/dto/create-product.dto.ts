import { Tags } from '../enums/tags.enums';

export interface CreateProductDTO {
  name: string;
  price: number;
  count: number;
  tags: Array<Tags>;
}
