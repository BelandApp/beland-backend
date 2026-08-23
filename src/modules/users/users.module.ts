import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/users.entity';
import { UsersRepository } from './users.repository';
import { Role } from '../roles/entities/role.entity';
import { RolesRepository } from '../roles/roles.repository';
import { AuthModule } from 'src/modules/auth/auth.module';
import { AdminsModule } from 'src/modules/admins/admins.module';
import { CloudinaryService } from 'src/modules/cloudinary/cloudinary.service';
import { BecoinCodeModule } from '../rewards/becoin-code/becoin-code.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role]),
    forwardRef(() => AuthModule),
    AdminsModule,
    BecoinCodeModule,
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    UsersRepository,
    RolesRepository,
    CloudinaryService,
  ],
  exports: [UsersService, UsersRepository, TypeOrmModule],
})
export class UsersModule {}
