import { Controller, Get, Logger, Param, UseGuards } from '@nestjs/common';

import { reqUser } from '@/auth/auth.decorator';
import { OptionalAuthGuard } from '@/auth/auth.guard';

import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { AnonymousProfile } from './dto/anonymous-profile.dto';
import { Profile } from './entities/profile.entity';

@Controller('user')
export class UserController {
    logger = new Logger(UserController.name);
    constructor(private readonly userService: UserService) {}

    @UseGuards(OptionalAuthGuard)
    @Get('/:username')
    async getUser(
        @reqUser() user: User,
        @Param('username') username: string,
    ): Promise<AnonymousProfile | Profile> {
        const profile = await this.userService.getProfile(username);

        if (!user || profile.user_no !== user.user_no) {
            return AnonymousProfile.of(profile);
        }

        return profile;
    }
}
