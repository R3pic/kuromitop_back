import {
    Controller, Get, Post, Param, Body, 
    UseGuards, HttpCode, HttpStatus, ParseIntPipe,
} from '@nestjs/common';

import { JwtAuthGuard } from '@common/guard/auth.guard';
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
    findManyRecent() {
        return this.trackService.findManyRecent();
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

    @UseGuards(JwtAuthGuard)
    @Get(routes.track.comments)
    @HttpCode(HttpStatus.OK)
    async getTrackComments(
        @Param('trackid', ParseIntPipe) trackId: number,
        @ReqUser() reqUser: RequestUser
    ) {
        return await this.trackService.getTrackComments(trackId, reqUser);
    }
}
