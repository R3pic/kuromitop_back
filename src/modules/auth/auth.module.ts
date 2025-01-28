import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PostgresModule } from '@common/database/postgres.module';
import { AuthRepository } from './auth.repository';
import { UserModule } from 'src/modules/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from '@common/env.validator';
import { PassportModule } from '@nestjs/passport';
import { CryptService } from '@common/crypt/crypt.service';
import { LocalStrategy } from './strategey/local.strategey';
import { JwtStrategy } from './strategey/jwt.strategey';
import { PublicStrategey } from './strategey/anonymous.strategey';

@Module({
    imports: [
        JwtModule.registerAsync({
            global: true,
            inject: [ConfigService],
            useFactory: (configService: ConfigService<EnvironmentVariables>) => ({
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: {
                    expiresIn: '60s',
                },
            }),
        }),
        PassportModule,
        PostgresModule,
        UserModule,
    ],
    controllers: [AuthController],
    providers: [
        AuthService, 
        AuthRepository,
        CryptService,
        LocalStrategy,
        JwtStrategy,
        PublicStrategey,
    ],
    exports: [PassportModule],
})
export class AuthModule {}
