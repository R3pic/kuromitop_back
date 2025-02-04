import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Transactional } from '@nestjs-cls/transactional';

import { RequestUser } from '@common/request-user';
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
        try {
            const user = await this.userService.findByUsername(loginDto.username);
    
            const isEqual = await user.validatePassword(loginDto.password);
            
            if (!isEqual) 
                throw new InvalidLocalCredentialException();
    
            return new RequestUser(user.id, user.username);
        } catch (e) {
            if (e instanceof UserNotFoundException)
                throw new InvalidLocalCredentialException();
            throw e;
        }
    }
}
