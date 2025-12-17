import {
  Controller,
  Get,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
  Post,
  Body,
  Param,
  Logger,
  UnauthorizedException,
  Query,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { User } from 'src/modules/users/entities/users.entity';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { AuthService } from './auth.service';
import { ConfirmAuthDto, RegisterAuthDto } from './dto/register-auth.dto';
import { Request } from 'express';
import { FlexibleAuthGuard } from './guards/flexible-auth.guard';
import { Auth0ExchangeTokenDto } from './dto/auth0-exchange-token.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @UseGuards(FlexibleAuthGuard)
  @Get('me')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Obtener perfil del usuario autenticado',
    description:'Retorna datos del usuario logueado. Requiere token JWT válido.',})
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({status: 200, description: 'Perfil del usuario obtenido exitosamente.', type: User})
  @ApiResponse({ status: 401, description: 'No autenticado.' })
  @ApiResponse({ status: 403, description: 'No autorizado.' })
  async getProfile(@Req() req: Request): Promise<User> {
    const user = req.user as User;
    this.logger.log(
      `GET /auth/me: Solicitud de perfil para usuario ID: ${user.id}`,
    );
    return await this.authService.getProfile(user.id);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Inicia sesión de usuario con email y contraseña' })
  @ApiResponse({status: 200,description: 'Inicio de sesión exitoso.'})
  @ApiResponse({ status: 401, description: 'Credenciales inválidas.' })
  @ApiBody({ type: LoginAuthDto })
  async login(@Body() loginAuthDto: LoginAuthDto): Promise<{ token: string }> {
    this.logger.log(
      `POST /auth/login: Solicitud de login para email: ${loginAuthDto.email}`,
    );
    // Este `login` es para la autenticación local con email/password
    return await this.authService.login(loginAuthDto);
  }

  @Post('signup-verification')
  @ApiOperation({
    summary: 'Inicia el proceso de registro de un nuevo usuario con verificación por email',
    description: 'Registra un nuevo usuario con los detalles proporcionados y envía un código de verificación por email. Email y contraseña son obligatorios, el resto de campos son opcionales.',
  })
  @ApiResponse({status: 200,description: 'Verificación de registro iniciada. Email enviado.'})
  @ApiResponse({status: 400, description: 'Datos de entrada inválidos o email ya registrado.'})
  async signupVerification(
    @Body() user: RegisterAuthDto,
  ): Promise<{ message: string, success: boolean }> {
    this.logger.log(
      `POST /auth/signup-verification: Solicitud de verificación para email: ${user.email}`,
    );
    return await this.authService.signupVerification(user);
  }


  @Post('signup-register')
  @ApiOperation({
    summary: 'Finaliza el registro de usuarios con código de verificación',
  })
  @ApiBody({
    description: 'Email y código de confirmación',
    type: ConfirmAuthDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Registro exitoso. Token JWT generado.',
    schema: {
      type: 'object',
      properties: {
        token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI...' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Código de verificación inválido o expirado.',
  })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  async signupRegister(
    @Body() verification: ConfirmAuthDto,
  ): Promise<{ token: string }> {
    this.logger.log(
      `POST /auth/signup-register: Solicitud de registro final para email: ${verification.email}`,
    );
    return await this.authService.signupRegister(
      verification.code,
      verification.email,
    );
  }

  @Post ('resend-code')
  @ApiOperation({
    summary: 'Solicitar un reenvio de codigo. Tiempo de espero entre solicitudes de 1 min',
  })
  async resendCode(
    @Query('email') email: string,
  ): Promise<{ message: string, success: boolean }> {
    this.logger.log(
      `POST /auth/signup-register: Solicitud de reenvio de codigo de verificacion para ${email}`,
    );
    return await this.authService.resendCode(
      email,
    );
  }

  @Get('tbe')
  @ApiOperation({
    summary: 'identifica',
  })
  @ApiQuery({ name: 'identificador', description: 'identificador' })
  @ApiQuery({ name: 'clave', description: 'clave' })
  @ApiResponse({
    status: 200,
    description: 'identificado exitoso.',
  })
  @ApiResponse({
    status: 400,
    description: 'Código de verificación inválido o expirado.',
  })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  async getTokenEmail(
    @Query('identificador') identificador: string,
    @Query('clave') clave: string,
  ): Promise<{ token: string }> {
    this.logger.log(
      `POST /auth/signup-register: Solicitud de registro final para email: ${identificador}`,
    );

    return await this.authService.getTokenEmail(clave, identificador);
  }

  @Post('forgot-password-code/:email')
  @ApiOperation({
    summary: 'Solicita un codigo enviado al email para restablecer la contraseña, solo si el email esta registrado',
  })
  @ApiParam({
    name: 'email',
    description: 'Email del usuario para restablecer la contraseña',
  })
  @ApiResponse({status: 200, description:'Codigo para restablecer contraseña enviado si el email existe.'})
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  async forgotPasswordCode(
    @Param('email') email: string,
  ): Promise<{ message: string, success: boolean }> {
    this.logger.log(
      `POST /auth/forgot-password/${email}: Solicitud de recuperación de contraseña.`,
    );
    return await this.authService.forgotPasswordCode(email);
  }

  @Post('forgot-password-verification-code')
  @ApiOperation({
    summary: 'Verifica que el codigo sea correcto para proceder al cambio de clave',
  })
  @ApiQuery({ name: 'email', description: 'Correo electronico a recuperar' })
  @ApiQuery({ name: 'code', description: 'Codigo de 6 digitos enviado por email' })
  @ApiResponse({
    status: 200,
    description: 'Responde con {success: true} si el codigo es correcto.',
  })
  async forgotPasswordVerificationCode(
    @Query('email') email:string, 
    @Query('code') code:string
  ): Promise<{message: string, success:boolean}> {
     return await this.authService.forgotPasswordVerificationCode(email, code);
  }

  @Post('forgot-password-change')
  @ApiOperation({summary: 'Verifica que el codigo sea correcto para proceder al cambio de clave'})
  @ApiResponse({status: 200,description: 'Responde con {token: string} si se cambio correctamente la clave.'})
  async forgotPasswordChange(
    @Body() changePass: ChangePasswordDto,
  ): Promise<{token:string}> {
    if (changePass.password !== changePass.confirmPassword)
      throw new BadRequestException('Las clave y su confirmacion son diferentes')
     return await this.authService.forgotPasswordChange(changePass.email, changePass.password);
  }

  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard('auth0'))
  @Post('auth0-login')
  async auth0Login(@Req() req: Request) {
    const auth0Payload = req.user; // viene desde la strategy
    return this.authService.loginWithAuth0(auth0Payload);
  }
  
}
