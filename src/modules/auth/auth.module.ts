import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PostgresModule } from '@common/database/postgres.module';
import { UserModule } from '@user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AccessJwtStrategy } from './strategey/jwt-access.strategey';
import { RefreshJwtStrategy } from './strategey/jwt-refresh.strategey';
import { PublicStrategey } from './strategey/anonymous.strategey';
import { SpotifyStrategy } from '@auth/strategey/spotify.strategey';
import { AuthRepository } from '@auth/auth.repository';

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
    AuthRepository,
    AuthService,
    AccessJwtStrategy,
    RefreshJwtStrategy,
    PublicStrategey,
    SpotifyStrategy,
  ],
  exports: [PassportModule],
})
export class AuthModule {}
