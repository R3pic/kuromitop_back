import {
  ExecutionContext, 
  Injectable, 
  UnauthorizedException, 
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class SpotifyOAuthGuard extends AuthGuard('spotify') {
  constructor() {
    super();
  }

  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }
}

@Injectable()
export class JwtAuthGuard extends AuthGuard('access') {
  constructor() {
    super();
  }

  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest<User>(err: Error, user: User) {
    if (err || !user) {
      throw err || new UnauthorizedException('액세스 토큰이 유효하지 않습니다.');
    }

    return user;
  }
}

@Injectable()
export class RefreshAuthGuard extends AuthGuard('refresh') {
  constructor() {
    super();
  }

  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest<User>(err: Error, user: User) {
    if (err || !user) {
      throw err || new UnauthorizedException('리프레시 토큰이 유효하지 않습니다.');
    }

    return user;
  }
}

@Injectable()
export class OptionalAuthGuard extends AuthGuard([ 'access', 'anonymous' ]) {
  constructor() {
    super();
  }

  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest<User>(err: Error, user: User) {
    if (err) {
      throw err;
    }

    return user;
  }
}