import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersDataService } from './users-data.service';
import { User } from './db/user.entity';
import { UserAddress } from './db/userAddress.entity';
import { UserValidatorService } from './user-validator.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [UsersController],
  providers: [UsersDataService, UserValidatorService, User, UserAddress],
  imports: [TypeOrmModule.forFeature([User, UserAddress])],
})
export class UsersModule {}
