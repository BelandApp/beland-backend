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

  // 1. Buscar el perfil
  const profile = await queryRunner.manager.findOne(Profile, {
    where: { name: profileName },
  });

  if (!profile) {
    throw new NotFoundException(
      `Perfil ${profileName} no encontrado`,
    );
  }

  // 2. Verificar si ya existe la relación
  const existingUserProfile = await queryRunner.manager.findOne(
    UserProfile,
    {
      where: {
        user_id: userId,
        profile_id: profile.id,
      },
    },
  );

  // 3. Crear relación si no existe
  if (!existingUserProfile) {
    const userProfile = queryRunner.manager.create(UserProfile, {
      user_id: userId,
      profile_id: profile.id,
    });

    await queryRunner.manager.save(userProfile);
  }
}
