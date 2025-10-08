// src/group-invitations/group-invitations.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupInvitation } from './entities/group-invitation.entity';
import { GroupInvitationsService } from './group-invitations.service';
import { GroupInvitationsController } from './group-invitations.controller';
import { UsersModule } from 'src/modules/users/users.module';
import { GroupsModule } from 'src/modules/groups/groups.module';
import { GroupMembersModule } from 'src/modules/group-members/group-members.module';
import { User } from 'src/modules/users/entities/users.entity';
import { GroupInvitationsRepository } from './group-invitations.repository';
import { AdminsModule } from 'src/modules/admins/admins.module'; // CORRECTED: Import AdminsModule
import { InvitationCleanupService } from './invitation-cleanup.service';
import { InvitationReminderService } from './invitation-reminder.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([GroupInvitation, User]),
    forwardRef(() => UsersModule),
    forwardRef(() => GroupsModule),
    forwardRef(() => GroupMembersModule),
    forwardRef(() => AdminsModule),
  ],
  controllers: [GroupInvitationsController],
  providers: [
    GroupInvitationsService,
    GroupInvitationsRepository,
    InvitationCleanupService,
    InvitationReminderService,
  ],
  exports: [GroupInvitationsService, GroupInvitationsRepository, TypeOrmModule],
})
export class GroupInvitationsModule {}
