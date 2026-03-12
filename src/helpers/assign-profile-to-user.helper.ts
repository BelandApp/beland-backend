import { QueryRunner } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { ProfileEnum } from 'src/modules/users/enums/profiles.enum';
import { Profile } from 'src/modules/users/entities/profile.entity';
import { UserProfile } from 'src/modules/users/entities/profile-user.entity';
import { Role } from 'src/modules/roles/entities/role.entity';
import { User } from 'src/modules/users/entities/users.entity';

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

  const role = await queryRunner.manager.findOne(Role, {where: {name: 'USER'}})
  const user = await queryRunner.manager.findOne(User, {where: {id: userId}})

  user.role_name = role.name;
  user.role= role;

  await queryRunner.manager.save(user)

  // 3. Crear relación si no existe
  if (!existingUserProfile) {
    const userProfile = queryRunner.manager.create(UserProfile, {
      user_id: userId,
      profile_id: profile.id,
    });

    await queryRunner.manager.save(userProfile);
  }
}
