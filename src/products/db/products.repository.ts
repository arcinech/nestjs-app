import { Product } from './products.entity';
import { dataSource } from '../../data-source';
import {
  FindManyOptions,
  Between,
  MoreThan,
  LessThan,
  Like,
  Equal,
  FindOptionsWhere,
} from 'typeorm';
import { ProductsQuery, TextFilterType } from '../queries/ProductsQuery';

export const ProductRepository = dataSource.getRepository(Product).extend({
  buildPredicate(query: ProductsQuery): FindManyOptions<Product> {
    const predicate: FindOptionsWhere<Product> = {};

    if (query.maxPrice && query.minPrice) {
      predicate.price = Between(query.minPrice, query.maxPrice);
    } else if (query.minPrice) {
      predicate.price = MoreThan(query.minPrice);
    } else if (query.maxPrice) {
      predicate.price = LessThan(query.maxPrice);
    }

    if (query.name && query.nameFilterType === TextFilterType.CONTAINS) {
      predicate.name = Like(`%${query.name}%`);
    } else if (query.name) {
      predicate.name = Equal(query.name);
    }

    if (query.minCount && query.maxCount) {
      predicate.count = Between(query.minCount, query.maxCount);
    } else if (query.minCount) {
      predicate.count = MoreThan(query.minCount);
    } else if (query.maxCount) {
      predicate.count = LessThan(query.maxCount);
    }

    const findManyOptions: FindManyOptions<Product> = {
      where: predicate,
    };

    findManyOptions.order = {
      [query.sortField || 'createdAt']: query.orderDirection || 'ASC',
    };

    return findManyOptions;
  },

  findAll(_query_: ProductsQuery): Promise<Product[]> {
    return this.find(this.buildPredicate(_query_));
  },
});
