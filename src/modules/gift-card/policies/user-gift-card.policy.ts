import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

import { User } from 'src/modules/users/entities/users.entity';

import { UserGiftCard } from '../entities/user-giftcard.entity'; 
import { RoleEnum } from 'src/modules/roles/enum/role-validate.enum';
import { Payload } from 'src/modules/auth/dto/payload.dto';

@Injectable()
export class UserGiftCardPolicy {
  
    canView(
    user: Payload,
    userGiftCard: UserGiftCard,
  ): void {
    const isOwner =
      userGiftCard.recipient_wallet
        ?.user_id === user.id;

    const isSuperAdmin =
      user.role_name === RoleEnum.SUPERADMIN;

    if (
      !isOwner &&
      !isSuperAdmin
    ) {
      throw new ForbiddenException(
        'No tienes permiso para acceder a esta gift card',
      );
    }
  }

}