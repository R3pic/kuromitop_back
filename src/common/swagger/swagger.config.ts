import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const options = new DocumentBuilder()
    .setTitle('꾸러미탑 API ')
    .setDescription('꾸러미탑 API')
    .setVersion('0.1')
    .addBearerAuth()
    .build();

export const documentFactory = (app: INestApplication) => SwaggerModule.createDocument(app, options);