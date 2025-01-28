import {
    Controller, Get, Post, Body,
    UseGuards,
    HttpCode,
    HttpStatus, 
} from '@nestjs/common';
import { UUID } from 'crypto';

import { MusicService } from './music.service';
import { CreateMusicDto } from './dto/create-music.dto';
import { JwtAuthGuard } from '@auth/auth.guard';
import { UUIDParam } from '@common/decorator/UUIDParam.decorator';
import { reqUser } from '@auth/auth.decorator';
import { User } from '@user/entities/user.entity';

@Controller('music')
export class MusicController {
    constructor(
        private readonly musicService: MusicService
    ) {}

    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.CREATED)
    @Post(':uuid')
    async create(
        @UUIDParam('uuid') uuid: UUID,
        @Body() createMusicDto: CreateMusicDto,
        @reqUser() user: User,
    ) {
        return await this.musicService.createBundleMusic(createMusicDto, uuid, user);
    }

    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    @Get(':uuid')
    async findByBundle(
        @UUIDParam('uuid') uuid: UUID,
        @reqUser() user: User
    ) {
        return await this.musicService.findManyByBundle(uuid, user);
    }
}
