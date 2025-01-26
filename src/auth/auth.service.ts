import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';
import { AuthRepository } from './auth.repository';
import { CryptService } from '@common/crypt/crypt.service';
import { UserService } from '@user/user.service';
import { User } from '@user/entities/user.entity';


@Injectable()
export class AuthService {
    constructor(
        private readonly authRepository: AuthRepository,
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly cryptService: CryptService,
    ) {}

    async signUp(signUpDto: SignUpDto) {
        const isExist = await this.userService.isExistByUsername(signUpDto.username);
        if (isExist) {
            throw new ConflictException('동일한 아이디가 존재합니다.');
        }

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

    async validateUser({ username, password }: SignInDto) {
        const hashedPassword = await this.authRepository.getPassword(username);

        if (!hashedPassword) 
            return null;

        const isEqual = await this.cryptService.validate(hashedPassword, password);

        if (!isEqual) 
            return null;

        const user = await this.userService.getByUsername(username);

        return user;
    }
}
