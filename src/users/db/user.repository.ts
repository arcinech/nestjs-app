import { dataSource } from '../../data-source';
import { User } from './user.entity';

export const UserRepository = dataSource.getRepository(User).extend({
  async getUserByEmail(email: string): Promise<User> {
    return await this.findOneBy({ email: email });
  },
});
