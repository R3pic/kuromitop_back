import {
    Body, Controller, HttpCode, HttpStatus, Logger, Post, Res, UseGuards, 
} from '@nestjs/common';
import type { Response } from 'express';


import { AuthService } from './auth.service';
import { reqUser } from './auth.decorator';
import { User } from '@user/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { AuthRegisterDto } from './dto/auth-register.dto';

@Controller('auth')
export class AuthController {
    logger = new Logger(AuthController.name);

    constructor(
        private readonly authService: AuthService,
    ) {}

    @HttpCode(HttpStatus.CREATED)
    @Post('/register')
    async register(
        @Body() authRegisterDto: AuthRegisterDto
    ) {
        await this.authService.register(authRegisterDto);
    }

    @UseGuards(AuthGuard('local'))
    @HttpCode(HttpStatus.OK)
    @Post('/login')
    async login(
        @reqUser() user: User,
        @Res({ passthrough: true }) res: Response
    ): Promise<void> {
        const access_token = await this.authService.login(user);

        res.cookie('access_token', access_token, {
            httpOnly: true,
            secure: true,
        });
    }
}
