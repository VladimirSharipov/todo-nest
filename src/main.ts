import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';

const logger = new Logger();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.disable('x-powered-by', 'X-Powered-By');

  app.setGlobalPrefix('api');
  app.use(cookieParser());

  const config = new DocumentBuilder()
    .setTitle('Todo-List')
    .setDescription('Todo-List - ежедневник')
    .setVersion('1.0')
    .addTag('Маршруты')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'https://localhost:3000',
      'https://127.0.0.1:3000',
    ],
    credentials: true,
    exposedHeaders: `set-cookie`,
  });
  // pp.enableCors({...}): Эта функция активирует политику CORS для вашего приложения.
  //  Origin: Это массив, который определяет, какие домены могут обращаться к вашему серверу. В данном случае разрешены запросы с localhost и 127.0.0.1 на порту 3000, как с протоколом http, так и https.
  //  credentials: true: Этот параметр указывает, что при запросах к серверу должны использоваться учетные данные (например, cookies или заголовки аутентификации).
  //exposedHeaders: 'set-cookie': Это указывает, что в ответах сервера будут доступны заголовки set-cookie. Это позволяет клиентским приложениям читать cookies, установленные сервером.
  await app.listen(process.env.API_PORT);
  logger.log(`server starting ${process.env.API_PORT}`);
}
bootstrap();
