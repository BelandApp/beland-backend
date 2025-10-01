// src/groups/groups.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupsService } from './groups.service';
import { GroupsController } from './groups.controller';
import { Group } from './entities/group.entity';
import { GroupsRepository } from './groups.repository';
import { GroupMember } from '../group-members/entities/group-member.entity';
import { GroupMembersRepository } from '../group-members/group-members.repository';
import { UsersModule } from 'src/modules/users/users.module'; // Importar UsersModule para la dependencia de UsersService
import { User } from 'src/modules/users/entities/users.entity'; // Importar la entidad User para TypeOrmModule.forFeature
import { AuthModule } from 'src/modules/auth/auth.module'; // Importar AuthModule para los guards de autenticación/autorización
import { AdminsModule } from 'src/modules/admins/admins.module'; // Importar AdminsModule
import { GroupMembersModule } from 'src/modules/group-members/group-members.module';
import { GroupInvitationsModule } from 'src/modules/group-invitations/group-invitations.module';

@Module({
  imports: [
    // Registrar entidades de TypeORM para este módulo. GroupMember y User son necesarios para las relaciones.
    TypeOrmModule.forFeature([Group, GroupMember, User]),
    // Usar forwardRef para resolver dependencias circulares si UsersModule o AuthModule también importan GroupsModule.
    forwardRef(() => UsersModule),
    forwardRef(() => AuthModule),
    forwardRef(() => AdminsModule),
    forwardRef(() => GroupMembersModule),
    forwardRef(() => GroupInvitationsModule),
  ],
  controllers: [GroupsController], // Registrar controladores manejados por este módulo
  providers: [GroupsService, GroupsRepository, GroupMembersRepository], // Registrar servicios y repositorios como proveedores
  // Exportar servicios y repositorios para que otros módulos puedan inyectarlos.
  exports: [
    GroupsService,
    GroupsRepository,
    GroupMembersRepository,
    TypeOrmModule,
  ],
})
export class GroupsModule {}
