import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

import { documentFactory } from '@common/swagger/swagger.config';
import { winstonLogger } from '@common/logger/winston.logger';
import { ServiceExceptionFilter } from '@common/filter/service-exception.filter';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  const app = await NestFactory.create(AppModule, {
    logger: winstonLogger,
  });

  SwaggerModule.setup('api-docs', app, documentFactory(app));

  app.use(cookieParser());
  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    forbidNonWhitelisted: true,
    whitelist: true,
  }));
  app.useGlobalFilters(new ServiceExceptionFilter());
  await app.listen(process.env.PORT ?? 3000);
  logger.log('Application started');
}

void bootstrap();
