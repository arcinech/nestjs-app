import {
  Controller,
  Get,
  Param,
  Post,
  Delete,
  Put,
  Body,
  HttpCode,
  ParseUUIDPipe,
} from '@nestjs/common';
import { UsersDataService } from './users-data.service';
import { ExternalUserDto } from './dto/external-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { dateToArray } from 'src/shared/helpers/date.helper';
import { User } from './db/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserValidatorService } from './user-validator.service';

@Controller('users')
export class UsersController {
  constructor(
    private usersRepository: UsersDataService,
    private usersValidators: UserValidatorService,
  ) {}

  mapUserToExternal(user: User): ExternalUserDto {
    return {
      ...user,
      birthdate: dateToArray(user.birthdate),
    };
  }

  @Get()
  async getAllUsers(): Promise<Array<ExternalUserDto>> {
    const users = await this.usersRepository.getAllUsers();
    return users.map((user) => this.mapUserToExternal(user));
  }

  @Get(':id')
  async getUserById(
    @Param('id', new ParseUUIDPipe({ version: '4' })) _id_: string,
  ): Promise<ExternalUserDto> {
    return this.mapUserToExternal(await this.usersRepository.getUserById(_id_));
  }

  @Post()
  async addUser(@Body() _user_: CreateUserDto): Promise<ExternalUserDto> {
    await this.usersValidators.validateUniqueEmail(_user_.email);
    return this.mapUserToExternal(await this.usersRepository.addUser(_user_));
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteUserById(
    @Param('id', new ParseUUIDPipe({ version: '4' })) _id_: string,
  ): Promise<void> {
    await this.usersRepository.deleteUserById(_id_);
  }

  @Put(':id')
  async updateUser(
    @Param('id', new ParseUUIDPipe({ version: '4' })) _id_: string,
    @Body() _user_: UpdateUserDto,
  ): Promise<ExternalUserDto> {
    return this.mapUserToExternal(
      await this.usersRepository.updateUserById(_id_, _user_),
    );
  }
}
