import {
    Body, Controller, HttpCode, HttpStatus, Logger, Post, Res, UseGuards, 
} from '@nestjs/common';
import type { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';

import { ReqUser } from '@common/decorator/req-user.decorator';
import { RequestUser } from '@common/request-user';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { routes } from '@common/config/routes';
import { RefreshAuthGuard } from '@common/guard/auth.guard';
import { tokenCookieOptions } from './constants';

@Controller(routes.auth.root)
export class AuthController {
    private readonly logger = new Logger(AuthController.name);

    constructor(private readonly authService: AuthService) {}

    @HttpCode(HttpStatus.CREATED)
    @Post(routes.auth.register)
    async register(
        @Body() authRegisterDto: RegisterDto
    ) {
        await this.authService.register(authRegisterDto);
    }

    @UseGuards(AuthGuard('local'))
    @HttpCode(HttpStatus.NO_CONTENT)
    @Post(routes.auth.login)
    async login(
        @ReqUser() user: RequestUser,
        @Res({ passthrough: true }) res: Response
    ) {
        const { accessToken, refreshToken } = await this.authService.login(user);
        res.cookie('access_token', accessToken, tokenCookieOptions);
        res.cookie('refresh_token', refreshToken, tokenCookieOptions);
    }

    @UseGuards(RefreshAuthGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    @Post(routes.auth.refresh)
    async refresh(
        @ReqUser() user: RequestUser,
        @Res({ passthrough: true }) res: Response
    ) {
        const accessToken = await this.authService.refresh(user);
        res.cookie('access_token', accessToken, tokenCookieOptions);
    }
}
