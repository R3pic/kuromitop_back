import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

import { AppModule } from './app.module';
import { documentFactory } from '@common/swagger/swagger.config';
import { winstonLogger } from '@common/logger/winston.logger';

async function bootstrap() {
    const logger = new Logger('Bootstrap');

    const app = await NestFactory.create(AppModule, {
        logger: winstonLogger
    });

    SwaggerModule.setup('api-docs', app, documentFactory(app));

    app.use(cookieParser());
    app.enableCors({
        origin: 'http://localhost:3000',
        credentials: true,
    });
    app.useGlobalPipes(new ValidationPipe({
        transform: true,
        forbidNonWhitelisted: true,
        whitelist: true,
    }));
    await app.listen(process.env.PORT ?? 3000);
    logger.log('Application started');
}

bootstrap();
