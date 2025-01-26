import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
    constructor() {
        super();
    }

    canActivate(context: ExecutionContext) {
        return super.canActivate(context);
    }

    handleRequest<User>(err: Error, user: User) {
        if (err || !user) {
            throw err || new UnauthorizedException('토큰이 유효하지 않습니다.');
        }

        return user;
    }
}

@Injectable()
export class PublicGuard extends AuthGuard(['jwt', 'public']) {
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