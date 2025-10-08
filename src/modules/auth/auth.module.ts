// src/auth/auth.module.ts
import { Global, Module, forwardRef } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from 'src/modules/users/entities/users.entity';
import { Wallet } from 'src/modules/wallets/entities/wallet.entity';
import { Role } from 'src/modules/roles/entities/role.entity';
import { Cart } from 'src/modules/cart/entities/cart.entity';
import { AuthVerification } from './entities/auth.entity';

import { AuthService } from './auth.service';
import { UsersRepository } from 'src/modules/users/users.repository';
import { RolesRepository } from 'src/modules/roles/roles.repository';
import { WalletsRepository } from 'src/modules/wallets/wallets.repository';

import { JwtStrategy } from './jwt.strategy';
import { AuthenticationGuard } from './guards/auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { FlexibleAuthGuard } from './guards/flexible-auth.guard';

import { UsersModule } from 'src/modules/users/users.module'; // Asegúrate de que UsersModule esté importado
import { RolesModule } from 'src/modules/roles/roles.module';
import { EmailService } from 'src/modules/email/email.service';
import { AuthController } from './auth.controller';
import { WalletsModule } from 'src/modules/wallets/wallets.module';
import { CartModule } from 'src/modules/cart/cart.module';

@Global()
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret:
          configService.get<string>('JWT_SECRET') ||
          'fallback_secret_for_dev_if_not_set',
        signOptions: { expiresIn: '2h' },
      }),
    }),
    TypeOrmModule.forFeature([User, Role, Wallet, AuthVerification, Cart]),
    forwardRef(() => UsersModule), // Importante: forwardRef para UsersModule
    forwardRef(() => WalletsModule),
    forwardRef(() => CartModule),
    ConfigModule,
    HttpModule,
    RolesModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    UsersRepository,
    RolesRepository,
    WalletsRepository,
    AuthenticationGuard, // Tu guardia de autenticación local
    JwtAuthGuard, // Tu guardia de autenticación de Auth0
    FlexibleAuthGuard, // Tu guardia que combina ambos
    EmailService,
  ],
  exports: [
    AuthService,
    AuthenticationGuard,
    JwtAuthGuard,
    FlexibleAuthGuard,
    JwtModule,
  ],
})
export class AuthModule {}
