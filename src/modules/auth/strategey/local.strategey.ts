import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from '@auth/auth.service';
import { AuthServiceException } from '@auth/exceptions';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super();
    }

    async validate(username: string, password: string) {
        const user = await this.authService.validateLogin({ username, password });

        if (!user) {
            throw AuthServiceException.INVAILD_LOGIN_CREDENTIAL;
        }
        
        return user;
    }
}