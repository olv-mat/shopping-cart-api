import { UserRoles } from 'src/modules/user/enums/user-roles.enum';
import { UserInterface } from '../interfaces/user.interface';
import { ForbiddenException } from '@nestjs/common';

export function checkUserPermission(user: UserInterface, uuid: string): void {
  const { role, sub } = user;
  if (role !== UserRoles.ADMIN && sub !== uuid) {
    throw new ForbiddenException(
      'You do not have permission to perform this action',
    );
  }
}
