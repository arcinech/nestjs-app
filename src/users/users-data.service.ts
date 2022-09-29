import { Injectable } from '@nestjs/common';
import { CreateUserAddressDto, CreateUserDto } from './dto/create-user.dto';
import { User } from './db/user.entity';
import { UpdateUserAddressDto, UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './db/user.repository';
import { UserAddressRepository } from './db/userAddress.repository';
import { UserAddress } from './db/userAddress.entity';

@Injectable()
export class UsersDataService {
  constructor(
    private userRepository: UserRepository,
    private userAddressRepository: UserAddressRepository,
  ) {}

  async prepareUserAddressesToSave(
    address: CreateUserAddressDto[] | UpdateUserAddressDto[],
  ): Promise<UserAddress[]> {
    const addresses: UserAddress[] = [];
    for (const add of address) {
      const addressToSave = new UserAddress();

      addressToSave.country = add.country;
      addressToSave.city = add.city;
      addressToSave.street = add.street;
      addressToSave.buildingNumber = add.buildingNumber;
      addressToSave.flatNumber = add?.flatNumber;

      addresses.push(await this.userAddressRepository.save(addressToSave));
    }

    return addresses;
  }

  async addUser(newUser: CreateUserDto): Promise<User> {
    const userAddress: UserAddress[] = await this.prepareUserAddressesToSave(
      newUser.address,
    );
    const userToSave = new User();
    userToSave.firstName = newUser.firstName;
    userToSave.lastName = newUser.lastName;
    userToSave.email = newUser.email;
    userToSave.role = newUser.role;
    userToSave.address = userAddress;

    return await this.userRepository.save(userToSave);
  }

  async updateUserById(id: string, updatedUser: UpdateUserDto): Promise<User> {
    await this.userAddressRepository.deleteUserAddressesByUserId(id);
    const userAddress: UserAddress[] = await this.prepareUserAddressesToSave(
      updatedUser.address,
    );
    const userToUpdate = await this.userRepository.findOne({
      where: { id: id },
    });

    userToUpdate.firstName = updatedUser.firstName;
    userToUpdate.lastName = updatedUser.lastName;
    userToUpdate.email = updatedUser.email;
    userToUpdate.role = updatedUser.role;
    userToUpdate.address = userAddress;

    return await this.userRepository.save(userToUpdate);
  }

  async deleteUserById(id: string): Promise<void> {
    this.userRepository.delete(id);
  }

  getUserById(id: string): Promise<User> {
    return this.userRepository.findOne({
      where: { id: id },
    });
  }

  getAllUsers(): Promise<User[]> {
    return this.userRepository.find();
  }
}
