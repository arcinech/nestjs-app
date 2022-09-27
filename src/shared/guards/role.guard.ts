import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Roles } from '../enums/roles.enums';

@Injectable()
export class RoleGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const role = context.switchToHttp().getRequest().headers['role'];
    return role === Roles.ADMIN || role === Roles.SELLER;
  }
}
