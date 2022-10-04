import { Injectable } from '@nestjs/common';
import { CreateUserAddressDto, CreateUserDto } from './dto/create-user.dto';
import { User } from './db/user.entity';
import { UpdateUserAddressDto, UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './db/user.repository';
import { UserAddressRepository } from './db/userAddress.repository';
import { UserAddress } from './db/userAddress.entity';
import { dataSource } from 'src/data-source';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class UsersDataService {
  async prepareUserAddressesToSave(
    address: CreateUserAddressDto[] | UpdateUserAddressDto[],
    UserAddressRepository: Repository<UserAddress>,
  ): Promise<UserAddress[]> {
    const addresses: UserAddress[] = [];
    for (const add of address) {
      const addressToSave = new UserAddress();

      addressToSave.country = add.country;
      addressToSave.city = add.city;
      addressToSave.street = add.street;
      addressToSave.buildingNumber = add.buildingNumber;
      addressToSave.flatNumber = add?.flatNumber;

      addresses.push(await UserAddressRepository.save(addressToSave));
    }

    return addresses;
  }

  async addUser(newUser: CreateUserDto): Promise<User> {
    return dataSource.transaction(async (manager: EntityManager) => {
      const userToSave = new User();

      userToSave.email = newUser.email;
      userToSave.firstName = newUser.firstName;
      userToSave.lastName = newUser.lastName;
      userToSave.role = newUser.role;
      userToSave.birthdate = newUser.birthdate;

      userToSave.address = await this.prepareUserAddressesToSave(
        newUser.address,
        manager.getRepository(UserAddress),
      );

      return await manager.getRepository(User).save(userToSave);
    });
  }

  async updateUserById(id: string, updatedUser: UpdateUserDto): Promise<User> {
    return dataSource.transaction(async (manager: EntityManager) => {
      const userManager = manager.getRepository(User);
      await manager
        .getRepository(UserAddress)
        .extend(UserAddressRepository)
        .deleteUserAddressesByUserId(id);

      const userToUpdate = await userManager.findOne({
        where: { id: id },
      });

      userToUpdate.firstName = updatedUser.firstName;
      userToUpdate.lastName = updatedUser.lastName;
      userToUpdate.email = updatedUser.email;
      userToUpdate.role = updatedUser.role;
      userToUpdate.birthdate = userToUpdate.birthdate;
      userToUpdate.address = await this.prepareUserAddressesToSave(
        userToUpdate.address,
        manager.getRepository(UserAddress),
      );

      return await userManager.save(userToUpdate);
    });
  }

  async deleteUserById(id: string): Promise<void> {
    UserRepository.delete(id);
  }

  getUserById(id: string): Promise<User> {
    return UserRepository.findOne({
      where: { id: id },
    });
  }

  getAllUsers(): Promise<User[]> {
    return UserRepository.find();
  }
}
