import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';

import { validate } from '@common/env.validator';

import * as path from 'node:path';
import { LoggerMiddleware } from '@common/logger/logger.middleware';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            validate,
            envFilePath: path.resolve(__dirname, '../.env'),
        }),
        AuthModule, 
        UserModule,
    ],
    exports: [],
    controllers: [],
    providers: [],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(LoggerMiddleware)
            .forRoutes('*');
    }
}
