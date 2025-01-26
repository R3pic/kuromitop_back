import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';

import { validate } from '@common/env.validator';

import * as path from 'node:path';
import { UserController } from '@user/user.controller';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            validate,
            envFilePath: path.resolve(__dirname, '../.env'),
        }),
        AuthModule, 
        UserModule
    ],
    controllers: [
        UserController
    ],
    providers: [
    ],
})
export class AppModule {}
