import { Body, Controller, Get, HttpCode, Post, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';

import { SignUpDto } from './dto/signup.dto';
import { AuthService } from './auth.service';
import { reqUser } from './auth.decorator';
import { User } from '@user/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { JwtGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ) {}

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

    @UseGuards(JwtGuard)
    @HttpCode(200)
    @Get('/test')
    test (
        @reqUser() user: User
    ) {
        return {
            ...user,
            message: '성공'
        };
    }

    @UseGuards(JwtGuard)
    @HttpCode(200)
    @Get('/testA')
    testA (
        @reqUser() user: User,
    ) {
        if (user)
            return user;

        return {
            user,
            message: '익명유저 성공'
        };

    }
}
