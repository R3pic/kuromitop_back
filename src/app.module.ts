import {
    Module, 
    NestModule, 
    MiddlewareConsumer, 
} from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { ConfigModule } from '@nestjs/config';

import { validate } from '@common/env.validator';

import * as path from 'node:path';
import { LoggerMiddleware } from '@common/logger/logger.middleware';
import { BundleModule } from './modules/bundle/bundle.module';
import { MusicModule } from './modules/music/music.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            validate,
            envFilePath: path.resolve(__dirname, '../../.env'),
        }),
        AuthModule, 
        UserModule,
        BundleModule,
        MusicModule,
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