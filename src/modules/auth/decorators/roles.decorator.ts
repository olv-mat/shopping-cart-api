import { SetMetadata } from '@nestjs/common';
import { UserRoles } from 'src/modules/user/enums/user-roles.enum';

/*
  Decorator That Defines Which Roles Can Access a Route. Stores The Roles
  Metadata To Be Evaluated By RolesGuard During Authorization Checks.
*/

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRoles[]) => SetMetadata(ROLES_KEY, roles);
