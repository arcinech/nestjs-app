import { Injectable } from '@nestjs/common';
import { UserRequireUniqueEmailException } from './exception/user-require-unique-email-exception';
import { UsersDataService } from './users-data.service';

@Injectable()
export class UserValidatorService {
  constructor(private usersRepository: UsersDataService) {}

  validateUniqueEmail(email: string): void {
    const user = this.usersRepository.getUserByEmail(email);
    if (user) {
      throw new UserRequireUniqueEmailException();
    }
  }
}
