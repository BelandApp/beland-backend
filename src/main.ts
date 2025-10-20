import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger, LogLevel } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { json, raw } from 'express';
import { ConfigService } from '@nestjs/config';

// Importaciones de middlewares de seguridad
import compression from 'compression';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

// Comentado para inhabilitar cualquier configuración de throttling
// import { ThrottlerGuard } from '@nestjs/throttler';
// import { Reflector } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // Configuración del logger basada en el entorno
    logger:
      process.env.NODE_ENV === 'production'
        ? ['error', 'warn', 'log']
        : (['debug', 'log', 'warn', 'error', 'verbose'] as LogLevel[]),
  });

  const configService = app.get(ConfigService);
  const appLogger = new Logger('main.ts');

  // Comentado para inhabilitar el guard de Throttler a nivel global.
  // if (configService.get<string>('NODE_ENV') === 'production') {
  //   app.useGlobalGuards(new ThrottlerGuard(new Reflector()));
  //   appLogger.log('✅ ThrottlerGuard (Rate Limiting) habilitado en producción.');
  // } else {
  //   appLogger.log('⚠️ ThrottlerGuard (Rate Limiting) deshabilitado en entorno de desarrollo.');
  // }

  // --- Seguridad y Middleware ---
  app.use(helmet());
  app.use(compression());
  // app.use(
  //   rateLimit({
  //     windowMs: 15 * 60 * 1000,
  //     max: configService.get<number>('THROTTLE_LIMIT') || 100,
  //     message:
  //       'Demasiadas solicitudes desde esta IP, por favor intente de nuevo después de 15 minutos.',
  //   }),
  // );

  app.setGlobalPrefix('api');
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // --- Configuración de CORS simplificada y segura ---
  /*const isProduction = process.env.NODE_ENV === 'production';

  const appMainUrlProd = configService.get<string>('APP_MAIN_URL_PROD');
  const appMainUrlLocal = configService.get<string>('APP_MAIN_URL_LOCAL');
  const appLandingUrlProd = configService.get<string>('APP_LANDING_URL_PROD');
  const appLandingUrlLocal = configService.get<string>('APP_LANDING_URL_LOCAL');

  appLogger.debug(`${appMainUrlProd}`, 'URL PRODUCCION');
  appLogger.debug(`${appMainUrlLocal}`, 'URL local MAIN');
  appLogger.debug(`${appLandingUrlProd}`, 'URL lANDING PRODUCCION');
  appLogger.debug(`${appLandingUrlLocal}`, 'URL LANDING LOCAL');

  const allowedOrigins: (string | RegExp)[] = isProduction
    ? [
        appMainUrlProd,
        appLandingUrlProd,
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:9080',
        'http://localhost:8081',
        'http://localhost:9002',
        'https://beland-project.netlify.app',
        'https://beland-production.up.railway.app/api',
        'https://belandlanding.vercel.app',
        'https://beland.app',
        'https://beland.land',
        'https://beland-backend-266662044893.us-east1.run.app',
        'https://beland-backend-266662044893.us-east1.run.app/api',
        'https://beland-backend-45tnbek6ya-uk.a.run.app',
        'https://beland-backend-45tnbek6ya-uk.a.run.app/api',
        configService.get<string>('CORS_ADDITIONAL_ORIGINS_PROD'),
        configService.get<string>('AUTH0_AUDIENCE'),
      ].filter(Boolean)
    : [
        configService.get<string>('CORS_ADDITIONAL_ORIGINS_LOCAL'),
        configService.get<string>('AUTH0_AUDIENCE'),
        'http://localhost:3000',
        'http://localhost:9080',
        'http://localhost:8081',
        'http://localhost:9002',
        'http://localhost:3001',
        'http://[::1]:3001',
        'https://beland-project.netlify.app',
        'https://beland-production.up.railway.app/api',
        'https://belandlanding.vercel.app',
        'https://beland-backend-266662044893.us-east1.run.app',
        /https:\/\/\w+\-beland\-\d+\.exp\.direct$/,
        /https:\/\/\w+\-anonymous\-\d+\.exp\.direct$/,
      ].filter(Boolean);

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) {
        appLogger.debug(`CORS: Origen no proporcionado, permitiendo acceso.`);
        return callback(null, true);
      }

      const isAllowed = allowedOrigins.some((allowedOrigin) => {
        if (typeof allowedOrigin === 'string') {
          return allowedOrigin === origin;
        }
        return allowedOrigin.test(origin);
      });

      if (isAllowed) {
        callback(null, true);
      } else {
        appLogger.warn(`CORS: Origen "${origin}" NO permitido.`);
        callback(new Error(`Not allowed by CORS: ${origin}`));
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  appLogger.log(
    `✅ CORS permitidos: ${allowedOrigins
      .map((o) => (typeof o === 'string' ? o : o.source))
      .join(', ')}`,
  );
  */
  // --- Configuración de CORS ---
  // 🚀 Configuración CORS simple y segura
  app.enableCors({
    origin: [
      'https://beland.app', // producción
      'https://admin.beland.app',
      'https://beland.land',
      'https://beland.work',
      'https://beland-project.netlify.app',
      'https://belandlanding.vercel.app',
      'https://beland-backend-266662044893.us-east1.run.app',
      'https://beland-backend-45tnbek6ya-uk.a.run.app',
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:9080',
      'http://localhost:8081',
      'http://localhost:9002',
      /https:\/\/\w+\-beland\-\d+\.exp\.direct$/,
      /https:\/\/\w+\-anonymous\-\d+\.exp\.direct$/,
    ],
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    credentials: true, // necesario para Auth0 y cookies
  });

  appLogger.log(`✅ CORS habilitado para https://beland.app y localhost`);
  // --- Fin de la configuración de CORS ---

  // --- Fin de la configuración de CORS simplificada ---

  // Configuración de Swagger/OpenAPI
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Beland API')
    .setDescription('Documentación de la API para la aplicación Beland')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Ingresa el token JWT (Bearer Token)',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      docExpansion: 'none',
      displayRequestDuration: true,
      filter: true,
      operationsSorter: 'alpha',
    },
  });

  // Middleware para parsear JSON y raw (para webhooks)
  app.use(json());
  app.use('/webhook/payphone', raw({ type: 'application/json' }));

  // Inicio de la aplicación en el puerto configurado.. 
  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');


  appLogger.log(`✅ Beland API corriendo en: http://localhost:${port}`);
  appLogger.log(`📘 Swagger disponible en: http://localhost:${port}/api/docs`);
}

void bootstrap();
