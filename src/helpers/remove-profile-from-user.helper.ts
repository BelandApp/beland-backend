import { UserProfile } from 'src/modules/users/entities/profile-user.entity';
import { Profile } from 'src/modules/users/entities/profile.entity';
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

  await queryRunner.manager.delete(UserProfile, {
    user_id: userId,
    profile_id: profile.id,
  });
}
