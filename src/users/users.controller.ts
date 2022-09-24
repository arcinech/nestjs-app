import {
  Controller,
  Get,
  Param,
  Post,
  Delete,
  Put,
  Body,
  HttpCode,
} from '@nestjs/common';
import { UsersDataService } from './users-data.service';
import { ExternalUserDto } from './dto/external-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { dateToArray } from 'src/shared/helpers/date.helper';
import { User } from './interfaces/user.interface';

@Controller('users')
export class UsersController {
  constructor(private usersRepository: UsersDataService) {}

  mapUserToExternal(user: User): ExternalUserDto {
    return {
      ...user,
      birthdate: dateToArray(user.birthdate),
    };
  }

  @Get()
  getAllUsers(): Array<ExternalUserDto> {
    return this.usersRepository
      .getAllUsers()
      .map((item) => this.mapUserToExternal(item));
  }

  @Get(':id')
  getUserById(@Param('id') _id_: string): ExternalUserDto {
    return this.mapUserToExternal(this.usersRepository.getUserById(_id_));
  }

  @Post()
  addUser(@Body() _user_: CreateUserDto): ExternalUserDto {
    return this.mapUserToExternal(this.usersRepository.addUser(_user_));
  }

  @Delete(':id')
  @HttpCode(204)
  deleteUserById(@Param('id') _id_: string): void {
    this.usersRepository.deleteUserById(_id_);
  }

  @Put(':id')
  updateUser(
    @Param('id') _id_: string,
    @Body() _user_: CreateUserDto,
  ): ExternalUserDto {
    return this.mapUserToExternal(
      this.usersRepository.updateUser(_id_, _user_),
    );
  }
}
