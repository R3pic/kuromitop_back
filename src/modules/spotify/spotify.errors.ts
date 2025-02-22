import { ServiceException } from '@common/base/service-exception.base';
import { UnauthorizedException } from '@nestjs/common';
import { Token } from '@auth/dto/token';

export class SpotifyTokenExpiredException extends ServiceException {
  static message = '스포티파이 액세스 토큰이 만료되었습니다.';
  constructor(
    public token: Token,
  ) {
    super(new UnauthorizedException(), SpotifyTokenExpiredException.message);
  }
}