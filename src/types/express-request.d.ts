import { RoleEnum, ValidRoleNames } from 'src/modules/roles/enum/role-validate.enum';
import { User } from 'src/modules/users/entities/users.entity';
import { ProfileEnum, ValidProfileNames } from 'src/modules/users/enums/profiles.enum';

declare module 'express-serve-static-core' {
  interface Request {
    rawBody?: Buffer;
    user?: {
      sub?:string,
      id: string,
      email: string,
      role_name: ValidRoleNames,
      wallet_id?: string,
      cart_id?: string,
      profiles?: ValidProfileNames[],
    };
  }
}
