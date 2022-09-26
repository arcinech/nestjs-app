import { Tags } from '../enums/tags.enums';

export interface UpdateProductDTO {
  name: string;
  price: number;
  count: number;
  tags: Array<Tags>;
}
