import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Transactional } from '@nestjs-cls/transactional';

import { AuthRegisterDto } from './dto/auth-register.dto';
import { AuthUsernameLoginDto } from './dto/auth-username-login.dto';
import { User } from '@user/entities/user.entity';

import { AuthRepository } from './auth.repository';
import { CryptService } from '@common/crypt/crypt.service';
import { UserService } from '@user/user.service';
import { AuthServiceException } from './exceptions';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);
    constructor(
        private readonly authRepository: AuthRepository,
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly cryptService: CryptService,
    ) {}

    @Transactional()
    async register(authRegisterDto: AuthRegisterDto) {
        const hashedPassword = await this.cryptService.hashPassword(authRegisterDto.password);
        const user = await this.userService.create(authRegisterDto.username);
        await this.authRepository.createPassword(user.user_no, hashedPassword);
    
        return true;
    }

    async login(user: User) {
        const payload = {
            user_no: user.user_no,
            username: user.username,
        };

        return await this.jwtService.signAsync(payload);
    }

    async validateLogin(authUsernameLoginDto: AuthUsernameLoginDto) {
        const password = await this.authRepository.findPasswordByUsername(authUsernameLoginDto.username);

        if (!password) 
            throw AuthServiceException.INVAILD_LOGIN_CREDENTIAL;

        const isEqual = await this.cryptService.comparePassword(password.password, authUsernameLoginDto.password);

        if (!isEqual) 
            throw AuthServiceException.INVAILD_LOGIN_CREDENTIAL;

        return {
            user_no: password.user_no,
            username: authUsernameLoginDto.username,
        };
    }
}
