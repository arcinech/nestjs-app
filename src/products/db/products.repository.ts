import { Product } from './products.entity';
import { dataSource } from '../../data-source';

export const ProductRepository = dataSource.getRepository(Product).extend({});
