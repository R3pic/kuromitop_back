import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PostgresModule } from '@common/database/postgres.module';
import { UserModule } from '@user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from '@common/env/env.validator';
import { PassportModule } from '@nestjs/passport';
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
                    expiresIn: '360s',
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
        LocalStrategy,
        JwtStrategy,
        PublicStrategey,
    ],
    exports: [PassportModule],
})
export class AuthModule {}
