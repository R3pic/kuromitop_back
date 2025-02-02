import {
    ExecutionContext, 
    Injectable, 
    UnauthorizedException, 
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
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
export class OptionalAuthGuard extends AuthGuard([ 'jwt', 'anonymous' ]) {
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