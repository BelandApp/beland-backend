import { User } from 'src/modules/users/entities/users.entity';

declare module 'express-serve-static-core' {
  interface Request {
    user?: User;
  }
}