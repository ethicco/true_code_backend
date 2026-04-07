import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  INestApplication,
  Logger,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import * as path from 'node:path';
import { AppSerializerInterceptor } from '@/common/interceprors';
import { settings } from '@/common/settings';
import cookieParser from 'cookie-parser';

const initializeSwaggerDocumentation = (
  app: INestApplication,
  swaggerPath: string,
): void => {
  const config = new DocumentBuilder()
    .setTitle(`REST API Документация сервиса`)
    .setVersion('1.0')
    .addCookieAuth('accessToken', {
      type: 'http',
      in: 'cookie',
      name: 'accessToken',
    })
    .addCookieAuth('refreshToken', {
      type: 'http',
      in: 'cookie',
      name: 'refreshToken',
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(swaggerPath, app, document);
};

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });

  const config = app.get(ConfigService);

  const globalPrefix = '/api';
  const swaggerPath = `/swagger-ui`;
  const port = config.get<number>('HTTP_API_PORT') || 3000;

  app.enableCors({
    origin: ['*', ...(config.get<string>('CORS_WHITELIST')?.split(',') || [])],
    credentials: true,
    exposedHeaders: ['set-cookie'],
  });
  app.use(cookieParser());
  app.useStaticAssets(path.join(process.cwd(), settings.UPLOAD_FOLDER), {
    prefix: settings.UPLOAD_FOLDER,
  });
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.setGlobalPrefix(globalPrefix);
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.useGlobalInterceptors(
    new AppSerializerInterceptor(app.get(Reflector), {
      strategy: 'excludeAll',
    }),
  );

  const logger = new Logger('main');

  initializeSwaggerDocumentation(app, swaggerPath);

  await app.listen(port, '0.0.0.0');
  const url = await app.getUrl();

  logger.log(`Swagger is running on: ${url}${swaggerPath}`);
  logger.log(`HTTP API server is running on: ${port} port`);
}

bootstrap();
