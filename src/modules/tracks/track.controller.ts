import {
  Controller, Get, Post, Param, Body,
  UseGuards, HttpCode, HttpStatus, ParseIntPipe, Delete, Query, Res,
} from '@nestjs/common';
import { Response } from 'express';

import { JwtAuthGuard, OptionalAuthGuard } from '@common/guard/auth.guard';
import { ReqUser } from '@common/decorator/req-user.decorator';
import { RequestUser } from '@common/request-user';
import { routes } from '@common/config/routes';

import { TrackService } from './track.service';
import { AddCommentBody } from './domain/dto/add-comment.body';
import { AddCommentDto } from './domain/dto/add-comment.dto';

@Controller(routes.track.root)
export class TrackController {
  constructor(
    private readonly trackService: TrackService
  ) {}

  @HttpCode(HttpStatus.OK)
  @Get(routes.track.recentComments)
  async findManyRecent() {
    return await this.trackService.findManyRecent();
  }

  @UseGuards(JwtAuthGuard)
  @Post(routes.track.comments)
  @HttpCode(HttpStatus.OK)
  async addComment(
    @Param('trackid', ParseIntPipe) trackId: number,
    @Body() content: AddCommentBody,
    @ReqUser() reqUser: RequestUser,
  ) {
    const addCommentDto = new AddCommentDto(trackId, content, reqUser);

    return await this.trackService.addCommentToTrack(addCommentDto);
  }

  @UseGuards(OptionalAuthGuard)
  @Get(routes.track.comments)
  @HttpCode(HttpStatus.OK)
  async getTrackComments(
    @Param('trackid', ParseIntPipe) trackId: number,
    @ReqUser() reqUser: RequestUser
  ) {
    return await this.trackService.getTrackComments(trackId, reqUser);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(routes.track.detail)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTrack(
    @Param('trackid', ParseIntPipe) trackId: number,
    @ReqUser() reqUser: RequestUser,
  ) {
    await this.trackService.remove({
      trackId,
      reqUser,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get(routes.track.search)
  @HttpCode(HttpStatus.OK)
  async searchTrack(
    @Query('q') q: string,
    @ReqUser() reqUser: RequestUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tracks = await this.trackService.search(q, reqUser);
    console.log(tracks);
    if (!tracks) {
      res.status(HttpStatus.UNPROCESSABLE_ENTITY);
      return {
        message: '다시 시도해주세요.',
      };
    } else {
      return {
        tracks,
      };
    }

  }
}
