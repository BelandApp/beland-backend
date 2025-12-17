// src/auth/guards/flexible-auth.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
  HttpStatus,
} from '@nestjs/common';
import { Request } from 'express';
import { Payload } from '../dto/payload.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class FlexibleAuthGuard implements CanActivate {
  private readonly logger = new Logger(FlexibleAuthGuard.name);

  constructor(
      private readonly jwtService: JwtService,
    ) {}
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest<Request>();
      const token = this.extractToken(request);
  
      if (!token) {
        this.logger.warn(
          'AuthenticationGuard: Acceso denegado. Token no proporcionado.',
        );
        throw new UnauthorizedException({
          statusCode: HttpStatus.UNAUTHORIZED,
          message: 'No autorizado. Token no proporcionado.',
          error: 'Unauthorized',
        });
      }
  
      try {
        // Usar la nueva interfaz LocalJwtPayload para tipar el payload decodificado
        const payload: Payload = this.jwtService.verify(token, {
          secret: process.env.JWT_SECRET,
        });
  
        // Adjuntar el objeto User completo a la request
        request.user = payload;
  
        this.logger.debug(
          `AuthenticationGuard: Token local verificado y usuario completo adjuntado a la request.`,
        );
        return true;
      } catch (error) {
        this.logger.warn(
          `AuthenticationGuard: Token local inválido o expirado. Error: ${
            (error as Error).message
          }`,
        );
        throw new UnauthorizedException({
          statusCode: HttpStatus.UNAUTHORIZED,
          message: 'No autorizado. Token inválido o expirado.',
          error: 'Unauthorized',
        });
      }
    }
  
    private extractToken(request: Request): string | null {
      const authHeader = request.headers['authorization'];
      if (authHeader?.startsWith('Bearer ')) {
        return authHeader.split(' ')[1];
      }
      return null;
    }
  /*constructor(
    private readonly localAuthGuard: AuthenticationGuard,
    private readonly jwtAuthGuard: JwtAuthGuard,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      this.logger.debug(
        'FlexibleAuthGuard: Intentando autenticación con JwtAuthGuard (Auth0)...',
      );
      const auth0Result = await this.jwtAuthGuard.canActivate(context);
      if (auth0Result) {
        this.logger.debug(
          'FlexibleAuthGuard: Autenticación exitosa con JwtAuthGuard (Auth0).',
        );
        return true;
      }
    } catch (auth0Error) {
      if (auth0Error instanceof UnauthorizedException) {
        this.logger.debug(
          `FlexibleAuthGuard: JwtAuthGuard falló: ${
            (auth0Error as Error).message
          }. Intentando con AuthenticationGuard (local)...`,
        );
        try {
          const localResult = await this.localAuthGuard.canActivate(context);
          if (localResult) {
            this.logger.debug(
              'FlexibleAuthGuard: Autenticación exitosa con AuthenticationGuard (local).',
            );
            return true;
          }
        } catch (localError) {
          this.logger.warn(
            `FlexibleAuthGuard: AuthenticationGuard también falló: ${
              (localError as Error).message
            }`,
          );
          // Si ambos fallan con Unauthorized, el último error es el que se propaga.
          throw localError;
        }
      } else {
        // Errores inesperados de JwtAuthGuard (ej. de configuración de Auth0, red)
        this.logger.error(
          `FlexibleAuthGuard: Error inesperado de JwtAuthGuard: ${
            (auth0Error as Error).message
          }`,
          (auth0Error as Error).stack,
        );
        throw auth0Error; // Propaga el error inesperado
      }
    }

    this.logger.warn(
      'FlexibleAuthGuard: Ni JwtAuthGuard ni AuthenticationGuard tuvieron éxito. Acceso denegado.',
    );
    throw new UnauthorizedException(
      'Fallo en la autenticación: No se encontró un token válido.',
    );
  }*/
}
