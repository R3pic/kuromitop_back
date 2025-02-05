import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PostgresModule } from '@common/database/postgres.module';
import { UserModule } from '@user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategey/local.strategey';
import { AccessJwtStrategy } from './strategey/jwt-access.strategey';
import { RefreshJwtStrategy } from './strategey/jwt-refresh.strategey';
import { PublicStrategey } from './strategey/anonymous.strategey';

@Module({
    imports: [
        JwtModule.register({
            signOptions: {
                expiresIn: '360s',
            },
        }),
        PassportModule,
        PostgresModule,
        UserModule,
    ],
    controllers: [AuthController],
    providers: [
        AuthService, 
        LocalStrategy,
        AccessJwtStrategy,
        RefreshJwtStrategy,
        PublicStrategey,
    ],
    exports: [PassportModule],
})
export class AuthModule {}
