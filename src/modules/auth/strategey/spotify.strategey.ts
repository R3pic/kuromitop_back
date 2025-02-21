import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-spotify';
import { AuthService } from '@auth/auth.service';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from '@common/env/env.validator';
import { type IncomingMessage } from 'node:http';

@Injectable()
export class SpotifyStrategy extends PassportStrategy(Strategy, 'spotify') {
  private readonly logger = new Logger(SpotifyStrategy.name);

  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService<EnvironmentVariables, true>,
  ) {
    super({
      clientID: configService.get('SPOTIFY_OAUTH_CLIENT_ID'),
      clientSecret: configService.get('SPOTIFY_OAUTH_CLIENT_SECRET'),
      callbackURL: `${configService.get('HOST')}:${configService.get('PORT')}/auth/spotify/callback`,
      scope: ['user-read-private'],
      passReqToCallback: true,
    });
  }

  async validate(
    req: IncomingMessage,
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ) {
    const user = await this.authService.registerOrFind({
      userId: profile.id,
      displayName: profile.displayName,
      thumbnail: profile._json.images[1].url || null,
      token: {
        accessToken,
        refreshToken,
      },
    });
    return {
      id: user.id,
    };
  }
}
