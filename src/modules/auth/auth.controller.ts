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
    description:
      'Retorna datos del usuario logueado. Requiere token JWT válido.',
  })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({
    status: 200,
    description: 'Perfil del usuario obtenido exitosamente.',
    type: User,
  })
  @ApiResponse({ status: 401, description: 'No autenticado.' })
  @ApiResponse({ status: 403, description: 'No autorizado.' })
  async getProfile(@Req() req: Request): Promise<User> {
    const user = req.user as User;
    this.logger.log(
      `GET /auth/me: Solicitud de perfil para usuario ID: ${user.id}`,
    );
    return user;
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Inicia sesión de usuario con email y contraseña' })
  @ApiResponse({
    status: 200,
    description: 'Inicio de sesión exitoso.',
    type: String, // Debería ser { token: string }
  })
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
    summary:
      'Inicia el proceso de registro de un nuevo usuario con verificación por email',
    description:
      'Registra un nuevo usuario con los detalles proporcionados y envía un código de verificación por email. Email y contraseña son obligatorios, el resto de campos son opcionales.',
  })
  @ApiResponse({
    status: 200,
    description: 'Verificación de registro iniciada. Email enviado.',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Código de verificación enviado a su email.',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de entrada inválidos o email ya registrado.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', format: 'email', example: 'test@example.com' },
        password: { type: 'string', example: 'StrongPassword123!' },
        confirmPassword: { type: 'string', example: 'StrongPassword123!' },
        username: { type: 'string', example: 'johndoe', nullable: true }, // Ahora opcional
        address: { type: 'string', example: '123 Main St', nullable: true }, // Ahora opcional
        phone: { type: 'number', example: 123456789, nullable: true }, // Ahora opcional
        country: { type: 'string', example: 'USA', nullable: true }, // Ahora opcional
        city: { type: 'string', example: 'New York', nullable: true }, // Ahora opcional
        full_name: {
          type: 'string',
          example: 'John Doe',
          description: 'Nombre completo del usuario (opcional)',
          nullable: true,
        },
        profile_picture_url: {
          type: 'string',
          format: 'url',
          example: 'https://example.com/photo.jpg',
          description: 'URL de la imagen de perfil (opcional)',
          nullable: true,
        },
      },
      // Solo email, password y confirmPassword son requeridos para este endpoint
      required: ['email', 'password', 'confirmPassword'],
    },
  })
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
  @ApiResponse({
    status: 200,
    description:
      'Codigo para restablecer contraseña enviado si el email existe.',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example:
            'Si el email está registrado, se ha enviado un codigo para restablecer la contraseña.',
        },
      },
    },
  })
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
  @ApiOperation({
    summary: 'Verifica que el codigo sea correcto para proceder al cambio de clave',
  })
  @ApiResponse({
    status: 200,
    description: 'Responde con {token: string} si se cambio correctamente la clave.',
  })
  async forgotPasswordChange(
    @Body() changePass: ChangePasswordDto,
  ): Promise<{token:string}> {
    if (changePass.password !== changePass.confirmPassword)
      throw new BadRequestException('Las clave y su confirmacion son diferentes')
     return await this.authService.forgotPasswordChange(changePass.email, changePass.password);
  }

  @Post('exchange-auth0-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary:
      'Intercambia un token de Auth0 por un token JWT local del backend.',
  })
  @ApiBody({
    description: 'Token de acceso JWT de Auth0.',
    type: Auth0ExchangeTokenDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Intercambio exitoso. Token JWT local generado.',
    schema: {
      type: 'object',
      properties: {
        token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI...' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Token de Auth0 inválido o no autorizado.',
  })
  async exchangeAuth0Token(
    @Body() auth0ExchangeTokenDto: Auth0ExchangeTokenDto,
  ): Promise<{ token: string }> {
    this.logger.log(
      'POST /auth/exchange-auth0-token: Solicitud de intercambio de token de Auth0 por token local.',
    );
    // Llama al método del servicio que usará JwtStrategy para validar el token de Auth0,
    // creará/actualizará el usuario y luego generará el token local.
    return this.authService.exchangeAuth0TokenForLocalToken(
      auth0ExchangeTokenDto.auth0Token,
    );
  }
}
