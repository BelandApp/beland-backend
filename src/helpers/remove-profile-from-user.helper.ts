import { Role } from 'src/modules/roles/entities/role.entity';
import { UserProfile } from 'src/modules/users/entities/profile-user.entity';
import { Profile } from 'src/modules/users/entities/profile.entity';
import { User } from 'src/modules/users/entities/users.entity';
import { ProfileEnum } from 'src/modules/users/enums/profiles.enum';
import { QueryRunner } from 'typeorm';

export async function removeProfileFromUser(
  queryRunner: QueryRunner,
  userId: string,
  profileName: ProfileEnum,
): Promise<void> {

  const profile = await queryRunner.manager.findOne(Profile, {
    where: { name: profileName },
  });

  if (!profile) return;

  const role = await queryRunner.manager.findOne(Role, {where: {name: 'COMMERCE'}})
  const user = await queryRunner.manager.findOne(User, {where: {id: userId}})

  user.role_name = role.name;
  user.role= role;

  await queryRunner.manager.save(user)

  await queryRunner.manager.delete(UserProfile, {
    user_id: userId,
    profile_id: profile.id,
  });
}
