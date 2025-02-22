import {
  forwardRef,
  Inject, Injectable, Logger,
} from '@nestjs/common';
import { SPOTIFY } from '@spotify/constants';
import { SpotifySearchResponse, SpotifyTrack } from '@spotify/spotify.types';
import { AuthService } from '@auth/auth.service';
import { RequestUser } from '@common/request-user';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from '@common/env/env.validator';
import { SpotifyTokenExpiredException } from '@spotify/spotify.errors';

@Injectable()
export class SpotifyService {
  private readonly logger = new Logger(SpotifyService.name);
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    private readonly configService: ConfigService<EnvironmentVariables, true>,
  ) {}

  async search(title: string, reqUser: RequestUser): Promise<SpotifyTrack[]> {
    const url = new URL(SPOTIFY.SEARCH_URL);
    url.searchParams.append('q', title);
    url.searchParams.append('type', 'track');
    url.searchParams.append('market', 'KR');
    console.log('요청 쿼리', url);
    const token = await this.authService.getSpotifyToken(reqUser.id);
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token.accessToken}`,
        'Accept-Language': 'ko-KR',
      },
    });

    if (response.status === 401) throw new SpotifyTokenExpiredException(token);

    const spotifyTracks = await response.json() as SpotifySearchResponse;
    return spotifyTracks.tracks.items.map((v) => ({
      id: v.id,
      title: v.name,
      artist: v.artists.map((v) => v.name).join(', '),
      thumbnail: v.album.images[1].url,
    }));
  }

  async refreshSpotifyToken(refreshToken: string, reqUser: RequestUser) {
    const response = await fetch(SPOTIFY.REFRESH_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: this.configService.get('SPOTIFY_OAUTH_CLIENT_ID'),
      }),
    });

    const data = await response.json();
    await this.authService.updateSpotifyToken(reqUser.id, {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
    });
  }
}