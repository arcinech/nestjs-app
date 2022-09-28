import { Injectable } from '@nestjs/common';
import { UserRequireUniqueEmailException } from './exception/user-require-unique-email-exception';
import { UsersDataService } from './users-data.service';

@Injectable()
export class UserValidatorService {
  constructor(private usersRepository: UsersDataService) {}

  async validateUniqueEmail(email: string): Promise<void> {
    const user = await this.usersRepository.getUserByEmail(email);
    if (user) {
      throw new UserRequireUniqueEmailException();
    }
  }
}
