import { UserAddress } from './userAddress.entity';
import { dataSource } from '../../data-source';

export const UserAddressRepository = dataSource
  .getRepository(UserAddress)
  .extend({
    async deleteUserAddressesByUserId(userId: string): Promise<void> {
      const usersAddresses = await this.find({
        where: { user: { id: userId } },
      });

      await this.remove(usersAddresses);
    },
  });
