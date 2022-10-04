import { Injectable } from '@nestjs/common';
import { UserRequireUniqueEmailException } from './exception/user-require-unique-email-exception';
import { UserRepository } from './db/user.repository';

@Injectable()
export class UserValidatorService {
  async validateUniqueEmail(email: string): Promise<void> {
    const user = await UserRepository.getUserByEmail(email);
    if (user) {
      throw new UserRequireUniqueEmailException();
    }
  }
}
