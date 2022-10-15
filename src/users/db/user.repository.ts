import { Roles } from 'src/shared/enums/roles.enums';
import {
  FindManyOptions,
  FindOptionsWhere,
  Equal,
  Like,
  Between,
  LessThan,
  MoreThan,
} from 'typeorm';
import { dataSource } from '../../data-source';
import { TextFilterType, UsersQuery } from '../queries/UsersQuery';
import { User } from './user.entity';

export const UserRepository = dataSource.getRepository(User).extend({
  async getUserByEmail(email: string): Promise<User> {
    return await this.findOneBy({ email: email });
  },

  buildPredicate(query: UsersQuery): FindManyOptions<User> {
    const predicate: FindOptionsWhere<User> = {};

    if (query.firstName) {
      predicate.firstName = Equal(query.firstName);
    }

    if (query.lastName) {
      predicate.lastName = Equal(query.lastName);
    }

    if (query.email && query.emailFilterType === TextFilterType.CONTAINS) {
      predicate.email = Like(`%${query.email}%`);
    } else if (query.email) {
      predicate.email = Equal(query.email);
    }

    if (query.minAge && query.maxAge) {
      predicate.birthdate = Between(
        new Date(query.minAge),
        new Date(query.maxAge),
      );
    } else if (query.minAge) {
      predicate.birthdate = LessThan(new Date(query.minAge));
    } else if (query.maxAge) {
      predicate.birthdate = MoreThan(new Date(query.maxAge));
    }

    if (query.role) {
      predicate.role = Equal(Roles[query.role]);
    }

    const findManyOptions: FindManyOptions<User> = {
      where: predicate,
    };

    findManyOptions.order = {
      [query.sortField || 'firstName']: query.orderDirection || 'ASC',
    };

    return findManyOptions;
  },

  findAll(_query_: UsersQuery): Promise<User[]> {
    return this.find(this.buildPredicate(_query_));
  },
});
