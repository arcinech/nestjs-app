import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './interfaces/user.interface';
import { UpdateUserDto } from './dto/update-user.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UsersDataService {
  private _users_: Array<User> = [];

  addUser(newUser: CreateUserDto): User {
    const user: User = {
      id: uuidv4(),
      ...newUser,
    };

    this._users_.push(user);
    return user;
  }

  updateUser(id: string, updatedUser: UpdateUserDto): User {
    this._users_.map((item) => {
      if (item.id === id) {
        return {
          ...updatedUser,
          id: item.id,
        };
      }
      return item;
    });

    return this.getUserById(id);
  }

  getUserById(id: string): User {
    return this._users_.find((item) => item.id === id);
  }

  getAllUsers(): Array<User> {
    return this._users_;
  }

  deleteUserById(id: string): void {
    this._users_.filter((item) => item.id !== id);
  }

  getUserByEmail(email: string): User {
    return this._users_.find((item) => item.email === email);
  }
}
