import { Body, Controller, HttpCode, Logger, Post, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';

import { SignUpDto } from './dto/signup.dto';
import { AuthService } from './auth.service';
import { reqUser } from './auth.decorator';
import { User } from '@user/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
    logger = new Logger(AuthController.name);

    constructor(
        private readonly authService: AuthService,
    ) {
    }

    @Post('/signup')
    async SignUp(
        @Body() signUpDto: SignUpDto
    ) {
        return await this.authService.signUp(signUpDto);
    }

    @UseGuards(AuthGuard('local'))
    @HttpCode(200)
    @Post('/signin')
    async SignIn(
        @reqUser() user: User,
        @Res() res: Response
    ) {
        const access_token = await this.authService.login(user);

        res.cookie('access_token', access_token, {
            httpOnly: true,
            secure: true,
        });

        res.send();
    }
}
