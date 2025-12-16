import { SetMetadata } from '@nestjs/common';
import { ProfileEnum } from 'src/modules/users/enums/profiles.enum'; 

export const PROFILES_KEY = 'profiles';

export const Profiles = (...profiles: ProfileEnum[]) =>
  SetMetadata(PROFILES_KEY, profiles);
