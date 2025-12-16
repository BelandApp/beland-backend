import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PROFILES_KEY } from '../decorators/profiles.decorator';
import { ProfileEnum } from 'src/modules/users/enums/profiles.enum'; 

@Injectable()
export class ProfilesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredProfiles = this.reflector.getAllAndOverride<ProfileEnum[]>(
      PROFILES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // Si no hay perfiles requeridos, se permite el acceso
    if (!requiredProfiles || requiredProfiles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !Array.isArray(user.profiles)) {
      throw new ForbiddenException('El usuario no tiene perfiles asignados');
    }

    // OR lógico → con que tenga uno, alcanza
    const hasProfile = requiredProfiles.some(profile =>
      user.profiles.includes(profile),
    );

    if (!hasProfile) {
      throw new ForbiddenException(
        'No tiene permisos para acceder a este recurso',
      );
    }

    return true;
  }
}
