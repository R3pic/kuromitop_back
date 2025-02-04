import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthService } from '@auth/auth.service';
import { InvalidLocalCredentialException } from '@auth/auth.errors';
import { LoginDto } from '@auth/dto/login.dto';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super();
    }

    async validate(username: string, password: string) {
        const loginDto = plainToInstance(LoginDto, {
            username,
            password,
        });

        await validateLoginDto(loginDto);

        const user = await this.authService.validateUser(loginDto);

        if (!user) {
            throw new InvalidLocalCredentialException();
        }
        
        return user;
    }
}

async function validateLoginDto(loginDto: LoginDto): Promise<void> {
    const errors = await validate(loginDto);

    if (errors.length > 0)
        // throw new BadRequestException(errors.map((e) => e.constraints && Object.values(e.constraints)).flat());
        throw new BadRequestException(errors.flatMap((e) => Object.values(e.constraints || {})));
}