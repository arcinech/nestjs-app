import { DataSource, Repository } from 'typeorm';
import { UserAddress } from './userAddress.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserAddressRepository extends Repository<UserAddress> {
  constructor(private dataSource: DataSource) {
    super(UserAddress, dataSource.createEntityManager());
  }
  async deleteUserAddressesByUserId(userId: string): Promise<void> {
    const usersAddresses = await this.find({ where: { user: { id: userId } } });

    await this.remove(usersAddresses);
  }
}
