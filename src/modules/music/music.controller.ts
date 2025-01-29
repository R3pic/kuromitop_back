import {
    Controller, Get,
    UseGuards,
    HttpCode,
    HttpStatus, 
} from '@nestjs/common';

import { MusicService } from './music.service';
import { OptionalAuthGuard } from '@auth/auth.guard';
import { reqUser } from '@auth/auth.decorator';
import { User } from '@user/entities/user.entity';

@Controller('music')
export class MusicController {
    constructor(
        private readonly musicService: MusicService
    ) {}

    @UseGuards(OptionalAuthGuard)
    @HttpCode(HttpStatus.OK)
    @Get('/recent')
    findManyRecent(
        @reqUser() user: User
    ) {
        return this.musicService.findManyRecent(user);
    }
}
