import {
  Controller, Get, HttpCode, HttpStatus, Logger, Post, Res, UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';

import { ReqUser } from '@common/decorator/req-user.decorator';
import { RequestUser } from '@common/request-user';
import { AuthService } from './auth.service';
import { routes } from '@common/config/routes';
import {
  JwtAuthGuard, RefreshAuthGuard, SpotifyOAuthGuard,
} from '@common/guard/auth.guard';
import { tokenCookieOptions } from './constants';

@Controller(routes.auth.root)
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private readonly authService: AuthService) {}

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post(routes.auth.login)
  async login() {}

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

  @UseGuards(SpotifyOAuthGuard)
  @Get(routes.auth.spotify.root)
  async spotifyRoot() {}

  @UseGuards(SpotifyOAuthGuard)
  @Get(routes.auth.spotify.callback)
  async spotifyCallback(
    @Res({ passthrough: true }) res: Response,
    @ReqUser() reqUser: RequestUser,
  ) {
    const { accessToken, refreshToken } = await this.authService.login(reqUser);
    res.cookie('access_token', accessToken, tokenCookieOptions);
    res.cookie('refresh_token', refreshToken, tokenCookieOptions);
    res.redirect('http://localhost:5173/home');
  }
}
