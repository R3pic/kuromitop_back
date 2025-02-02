import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Transactional } from '@nestjs-cls/transactional';

import { RequestUser } from '@common/request-user';
import { UserService } from '@user/user.service';
import { RegisterDto } from './dto/register.dto';
import { InvalidLocalCredentialException } from './auth.error';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) {}

    @Transactional()
    async register(registerDto: RegisterDto) {
        await this.userService.create(registerDto);
    }

    async login(user: RequestUser) {
        const payload: RequestUser = {
            ...user,
        };

        return await this.jwtService.signAsync(payload);
    }

    async validateUser(loginDto: LoginDto) {
        const user = await this.userService.findByUsername(loginDto.username);
        if (!user)
            throw new InvalidLocalCredentialException();

        const isEqual = await user.validatePassword(loginDto.password);
        
        if (!isEqual) 
            throw new InvalidLocalCredentialException();

        return new RequestUser(user.id, user.username);
    }
}
