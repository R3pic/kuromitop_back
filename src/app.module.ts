import {
    Module, 
    NestModule, 
    MiddlewareConsumer, 
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '@auth/auth.module';
import { UserModule } from '@user/user.module';
import { LoggerMiddleware } from '@common/logger/logger.middleware';
import { BundleModule } from '@bundle/bundle.module';
import { MusicModule } from '@music/music.module';
import { CommentsModule } from '@comments/comments.module';
import { configModuleOptions } from '@common/env/env.config';

@Module({
    imports: [
        ConfigModule.forRoot(configModuleOptions),
        AuthModule, 
        UserModule,
        BundleModule,
        MusicModule,
        CommentsModule,
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