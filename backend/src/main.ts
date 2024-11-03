import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import * as requestIp from 'request-ip';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  // CORS is enabled
  const app = await NestFactory.create(AppModule, { cors: true, logger: ['error', 'warn', 'log', 'debug', 'verbose'] });
  const configService = app.get(ConfigService);
  const port = configService.get('PORT') || 8080;
  // Request Validation
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  app.use(requestIp.mw());

  // Helmet Middleware against known security vulnerabilities
  app.use(helmet());
  app.enableCors({
    origin: configService.get('NEXTAUTH_URL'),
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  // Swagger API Documentation
  const options = new DocumentBuilder()
    .setTitle('NestJS Media scrapper Backend')
    .setDescription('NestJS Media scrapper Backend API description')
    .setVersion('0.1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(port || 8080);
}

bootstrap();
