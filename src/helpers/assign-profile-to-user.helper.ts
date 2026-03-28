import { QueryRunner } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { ProfileEnum } from 'src/modules/users/enums/profiles.enum';
import { Profile } from 'src/modules/users/entities/profile.entity';
import { UserProfile } from 'src/modules/users/entities/profile-user.entity';

export async function assignProfileToUser(
  queryRunner: QueryRunner,
  userId: string,
  profileName: ProfileEnum,
): Promise<void> {
  const profile = await queryRunner.manager.findOne(Profile, {
    where: { name: profileName },
  });

  if (!profile) {
    throw new NotFoundException(`Perfil ${profileName} no encontrado`);
  }

  const existingUserProfile = await queryRunner.manager.findOne(UserProfile, {
    where: {
      user_id: userId,
      profile_id: profile.id,
    },
  });

  if (!existingUserProfile) {
    const userProfile = queryRunner.manager.create(UserProfile, {
      user_id: userId,
      profile_id: profile.id,
    });

    await queryRunner.manager.save(userProfile);
  }
}
