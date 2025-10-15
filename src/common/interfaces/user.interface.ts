import { UserRoles } from 'src/modules/user/enums/user-roles.enum';

export interface UserInterface {
  sub: string;
  name: string;
  email: string;
  role: UserRoles;
}
