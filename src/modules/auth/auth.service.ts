import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { RequestUser } from '@common/request-user';
import { EnvironmentVariables } from '@common/env/env.validator';
import { UserService } from '@user/user.service';
import { SpotifyProfileDto } from '@auth/dto/spotify-profile.dto';
import { UserNotFoundException } from '@user/user.errors';
import { AuthRepository } from '@auth/auth.repository';
import { Token } from '@auth/dto/token';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<EnvironmentVariables, true>
  ) {}

  async registerOrFind(spotifyProfile: SpotifyProfileDto) {
    this.logger.log(spotifyProfile);
    try {
      const user = await this.userService.findById(spotifyProfile.userId);
      await this.authRepository.updateSpotifyToken(user.id, spotifyProfile.token);
      return user;
    } catch (e) {
      if (e instanceof UserNotFoundException) {
        const user = await this.userService.create({
          id: spotifyProfile.userId,
          displayName: spotifyProfile.displayName,
          thumbnail: spotifyProfile.thumbnail,
        });
        await this.authRepository.save(user.id, spotifyProfile.token);
        return user;
      } else {
        throw e;
      }
    }
  }

  async login(reqUser: RequestUser) {
    this.logger.log('login');
    const accessToken = await this.getAccessToken(reqUser);
    const refreshToken = await this.getRefreshToken(reqUser);
    return {
      accessToken,
      refreshToken,
    };
  }

  async refresh(reqUser: RequestUser) {
    return await this.getAccessToken(reqUser);
  }

  async getSpotifyToken(userId: string) : Promise<Token> {
    const tokenModel = await this.authRepository.findTokenByUserId(userId);

    return {
      accessToken: tokenModel.access_token,
      refreshToken: tokenModel.refresh_token,
    };
  }

  async updateSpotifyToken(userId: string, token: Token) {
    this.logger.log(`updateSpotifyToken ${JSON.stringify(token)}`);
    await this.authRepository.updateSpotifyToken(userId, token);
  }

  private async getAccessToken(payload: RequestUser) {
    return this.jwtService.signAsync({ ...payload }, {
      secret: this.configService.get('ACCESS_TOKEN_SECRET'),
      expiresIn: '1h',
    });
  }

  private async getRefreshToken(payload: RequestUser) {
    return this.jwtService.signAsync({ ...payload }, {
      secret: this.configService.get('REFRESH_TOKEN_SECRET'),
      expiresIn: '30d',
    });
  }
}
