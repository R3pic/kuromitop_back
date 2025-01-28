import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AuthRegisterDto } from './dto/auth-register.dto';
import { AuthUsernameLoginDto } from './dto/auth-username-login.dto';
import { User } from '@user/entities/user.entity';

import { AuthRepository } from './auth.repository';
import { CryptService } from '@common/crypt/crypt.service';
import { UserService } from '@user/user.service';
import { AuthServiceException } from './exceptions';


@Injectable()
export class AuthService {
    constructor(
        private readonly authRepository: AuthRepository,
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly cryptService: CryptService,
    ) {}

    async register(signUpDto: AuthRegisterDto) {
        await this.userService.isExistByUsername(signUpDto.username);

        signUpDto.password = await this.cryptService.hashPassword(signUpDto.password);

        await this.authRepository.create(signUpDto);
    }

    async login(user: User) {
        const payload = {
            user_no: user.user_no,
            username: user.username,
        };

        return await this.jwtService.signAsync(payload);
    }

    async validateLogin(authUsernameLoginDto: AuthUsernameLoginDto) {
        const password = await this.authRepository.getPassword(authUsernameLoginDto.username);

        if (!password) 
            throw AuthServiceException.INVAILD_LOGIN_CREDENTIAL;

        const isEqual = await this.cryptService.comparePassword(password.password, authUsernameLoginDto.password);

        if (!isEqual) 
            throw AuthServiceException.INVAILD_LOGIN_CREDENTIAL;

        const user = await this.userService.findByNo(password.user_no);

        return user;
    }
}
