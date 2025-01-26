import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

import { AppModule } from './app.module';

async function bootstrap() {
    const logger = new Logger('Bootstrap');

    const app = await NestFactory.create(AppModule);

    const config = new DocumentBuilder()
        .setTitle('꾸러미탑 API ')
        .setDescription('꾸러미탑 API')
        .setVersion('0.1')
        .build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, documentFactory);

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
