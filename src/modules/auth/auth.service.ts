import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Transactional } from '@nestjs-cls/transactional';

import { RequestUser } from '@common/request-user';
import { EnvironmentVariables } from '@common/env/env.validator';
import { UserService } from '@user/user.service';
import { RegisterDto } from './dto/register.dto';
import { InvalidLocalCredentialException } from './auth.errors';
import { LoginDto } from './dto/login.dto';
import { UserNotFoundException } from '@user/user.errors';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService<EnvironmentVariables, true>
    ) {}

    @Transactional()
    async register(registerDto: RegisterDto) {
        await this.userService.create(registerDto);
    }

    async login(reqUser: RequestUser) {
        const accessToken = await this.getAccessToken(reqUser);
        const refreshToken = await this.getRefreshToken(reqUser);
        return {
            accessToken,
            refreshToken,
        };
    }

    async refresh(reqUser: RequestUser) {
        const accessToken = await this.getAccessToken(reqUser);
        return accessToken;
    }

    async validateUser(loginDto: LoginDto) {
        try {
            const user = await this.userService.findByUsername(loginDto.username);
            const isEqual = await user.comparePassword(loginDto.password);
            
            if (!isEqual) 
                throw new InvalidLocalCredentialException();
    
            return new RequestUser(user.id, user.username);
        } catch (e) {
            if (e instanceof UserNotFoundException)
                throw new InvalidLocalCredentialException();
            throw e;
        }
    }

    private async getAccessToken(payload: RequestUser) {
        return this.jwtService.signAsync({ ...payload }, {
            secret: this.configService.get('ACCESS_TOKEN_SECRET'),
            expiresIn: '60s',
        });
    }

    private async getRefreshToken(payload: RequestUser) {
        return this.jwtService.signAsync({ ...payload }, {
            secret: this.configService.get('REFRESH_TOKEN_SECRET'),
            expiresIn: '1h',
        });
    }
}
