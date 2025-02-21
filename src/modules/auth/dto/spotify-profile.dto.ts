import { Token } from '@auth/dto/token';

export class SpotifyProfileDto {
  userId: string;
  displayName: string;
  thumbnail: string;
  token: Token;
}

