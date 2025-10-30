
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { abortOnError: false });

  // Check if NATS_URLS is available before setting up microservices
  if (process.env.NATS_URLS) {
    try {
      app.connectMicroservice<MicroserviceOptions>({
        transport: Transport.NATS,
        options: {
          servers: (process.env.NATS_URLS as string).split(',').filter(
            (server) => server.trim().length > 0,
          ),
          queue: 'lms',
          debug: true,
        },
      });

      await app.startAllMicroservices();
      console.log('Microservices started successfully');
    } catch (error) {
      console.error('Failed to start microservices:', error);
    }
  } else {
    console.log('NATS_URLS not configured, skipping microservices setup');
  }

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: false,
    }),
  );

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('Authentication API')
    .setDescription('Comprehensive Authentication & User Management API Documentation')
    .setVersion('1.0')
    .addTag('Authentication', 'User authentication endpoints including registration and login')
    .addTag('User', 'User profile and data management endpoints')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addServer(`http://localhost:${process.env.PORT ?? 3000}`, 'Development Server')
    .setContact(
      'API Support',
      'https://example.com/support',
      'support@example.com'
    )
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'Auth API Docs',
    customfavIcon: 'https://nestjs.com/img/logo-small.svg',
    customCss: '.swagger-ui .topbar { display: none }',
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'none',
      filter: true,
      showRequestDuration: true,
    },
  });

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
  console.log(`Swagger documentation available at: ${await app.getUrl()}/api/docs`);
}
bootstrap();