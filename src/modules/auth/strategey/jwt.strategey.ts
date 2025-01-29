import { AuthService } from '@auth/auth.service';
import { EnvironmentVariables } from '@common/env/env.validator';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

interface PayLoad {
    user_no: number;
    username: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    logger = new Logger(JwtStrategy.name);
    constructor(
        private readonly authService: AuthService,
        private readonly configService: ConfigService<EnvironmentVariables, true>,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get<string>('JWT_SECRET'),
        });
    }

    validate({ user_no, username }: PayLoad) {        
        return {
            user_no,
            username,
        };
    }
}