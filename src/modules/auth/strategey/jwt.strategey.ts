import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { EnvironmentVariables } from '@common/env/env.validator';
import { RequestUser } from '@common/request-user';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    logger = new Logger(JwtStrategy.name);
    constructor(
        private readonly configService: ConfigService<EnvironmentVariables, true>,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get<string>('JWT_SECRET'),
        });
    }

    validate(reqUser: RequestUser) {        
        return {
            id: reqUser.id,
            username: reqUser.username,
        };
    }
}