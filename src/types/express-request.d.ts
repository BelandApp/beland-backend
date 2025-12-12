import { RoleEnum, ValidRoleNames } from 'src/modules/roles/enum/role-validate.enum';
import { User } from 'src/modules/users/entities/users.entity';

declare module 'express-serve-static-core' {
  interface Request {
    user?: User | {
      sub:string,
      id: string,
      email: string,
      role_name: string,
      wallet_id?: string,
      cart_id?: string,
      auth0_id?: string,
    };
  }
}