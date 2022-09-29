import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from './user.entity';

// @EntityRepository(User)
@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }
  async getUserByEmail(email: string): Promise<User> {
    return await this.findOneBy({ email: email });
  }
}
