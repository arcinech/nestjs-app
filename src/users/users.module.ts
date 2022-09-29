import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersDataService } from './users-data.service';
import { UserRepository } from './db/user.repository';
import { UserAddressRepository } from './db/userAddress.repository';
import { UserValidatorService } from './user-validator.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [UsersController],
  providers: [
    UsersDataService,
    UserValidatorService,
    UserRepository,
    UserAddressRepository,
  ],
  imports: [TypeOrmModule.forFeature([UserAddressRepository, UserRepository])],
})
export class UsersModule {}
