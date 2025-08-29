// notifications-socket.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import * as jwt from 'jsonwebtoken';

// notifications-socket.gateway.ts
import {
  Injectable,
} from '@nestjs/common';
import jwksClient, { JwksClient } from 'jwks-rsa';
import { ConfigService } from '@nestjs/config';
import { UsersRepository } from 'src/users/users.repository';

export interface respSocket {
  wallet_id: string;
  message: string;
  amount: number;
  success: boolean;
  amount_payment_id_deleted?: string | null;
}

@WebSocketGateway({
  cors: { origin: '*' },
})
@Injectable()
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private jwks?: JwksClient;

  constructor(
    private readonly configService: ConfigService,
    private readonly usersRepository: UsersRepository,
  ) {
    const auth0Domain = this.configService.get<string>('AUTH0_DOMAIN');
    if (auth0Domain) {
      this.jwks = jwksClient({
        jwksUri: `https://${auth0Domain}/.well-known/jwks.json`,
        cache: true,
        rateLimit: true,
      });
    }
  }

  async handleConnection(client: Socket) {
    try {
      // EXTRAER token (soporta handshake.auth.token y query token y header Authorization)
      const auth = client.handshake.auth || {};
      const headerAuth =
        (client.handshake.headers?.authorization as string) || '';
      const rawProvided =
        typeof auth.token === 'string'
          ? auth.token
          : headerAuth?.startsWith('Bearer ')
          ? headerAuth.split(' ')[1]
          : (auth as any).accessToken || (auth as any).token || client.handshake.query?.token;

      const rawToken = typeof rawProvided === 'string' ? rawProvided : null;
      if (!rawToken) {
        console.warn(`Socket ${client.id} disconnect: token missing`);
        client.disconnect(true);
        return;
      }

      let userId: string | null = null;

      // 1) Intentar Auth0 (si está configurado AUTH0_DOMAIN)
      if (this.jwks) {
        try {
          const payload: any = await this.verifyAuth0Token(rawToken);
          const auth0_id = payload?.sub;
          if (!auth0_id) throw new Error('Auth0 token sin sub');

          // BUSCAR USUARIO POR auth0_id
          // <-- ADAPTA: cambia el nombre del método si tu UsersService usa otro (ej: findOrCreateAuth0User)
          const user = await this.usersRepository.findByAuth0Id(auth0_id);
          if (!user) {
            console.warn(
              `Socket ${client.id}: no existe user para auth0_id=${auth0_id} -> desconectando`,
            );
            client.disconnect(true);
            return;
          }

          userId = String(user.id);
          console.log(
            `Socket ${client.id}: autenticado vía Auth0 -> user.id=${userId}`,
          );
        } catch (err) {
          // Falló Auth0: lo registramos y seguimos para intentar token local
          console.debug(
            `Socket ${client.id}: validación Auth0 falló: ${(err as Error).message}`,
          );
        }
      }

      // 2) Si no se resolvió por Auth0, intentar token local (HS256)
      if (!userId) {
        try {
          const secret = this.configService.get<string>('JWT_SECRET') || process.env.JWT_SECRET;
          if (!secret) throw new Error('JWT_SECRET no configurado');

          const payloadLocal: any = jwt.verify(rawToken, secret) as any;
          const possibleUserId = payloadLocal?.sub || payloadLocal?.userId;
          if (!possibleUserId) throw new Error('Token local sin sub/userId');

          // BUSCAR USUARIO POR id interno
          // <-- ADAPTA: cambia el nombre del método si tu UsersService usa otro
          const user = await this.usersRepository.findById(possibleUserId);
          if (!user) {
            console.warn(
              `Socket ${client.id}: usuario local no encontrado id=${possibleUserId} -> desconectando`,
            );
            client.disconnect(true);
            return;
          }

          userId = String(user.id);
          console.log(
            `Socket ${client.id}: autenticado vía token local -> user.id=${userId}`,
          );
        } catch (err) {
          console.warn(
            `Socket ${client.id}: validación token local falló: ${(err as Error).message} -> desconectando`,
          );
          client.disconnect(true);
          return;
        }
      }

      // 3) Si obtuvimos userId, guardarlo en el socket y unir a la room
      if (!userId) {
        console.warn(`Socket ${client.id}: no se pudo resolver userId -> desconectando`);
        client.disconnect(true);
        return;
      }

      client.data.userId = userId;
      client.join(`user_${userId}`);
      console.log(`Usuario ${userId} conectado a sala user_${userId}`);
    } catch (err) {
      console.error(`Error en handleConnection: ${(err as Error).message}`);
      client.disconnect(true);
    }
  }

  async handleDisconnect(client: Socket) {
    console.log(`Socket disconnected: ${client.id}`);
  }

  // Helper: verifica token Auth0 usando JWKS
  private verifyAuth0Token(token: string): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const decodedHeader: any = jwt.decode(token, { complete: true });
        const kid = decodedHeader?.header?.kid;
        if (!kid || !this.jwks) return reject(new Error('Token Auth0 sin KID o JWKS no configurado'));

        this.jwks.getSigningKey(kid, (err, key) => {
          if (err) return reject(err);
          const signingKey = (key as any).getPublicKey();
          const auth0Audience = this.configService.get<string>('AUTH0_AUDIENCE');
          const auth0Issuer = `https://${this.configService.get<string>('AUTH0_DOMAIN')}/`;

          jwt.verify(
            token,
            signingKey,
            { algorithms: ['RS256'], audience: auth0Audience, issuer: auth0Issuer },
            (verifyErr, decoded) => {
              if (verifyErr) return reject(verifyErr);
              resolve(decoded);
            },
          );
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  // Método para notificar a un usuario (mantengo tu tipo respSocket)
  notifyUser(userId: string, payload: respSocket) {
    this.server.to(`user_${userId}`).emit('payment-success', payload);
  }
}
