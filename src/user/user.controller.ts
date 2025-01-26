import { Controller, Get, Logger, NotFoundException, Param, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { reqUser } from '@auth/auth.decorator';
import { User } from './entities/user.entity';
import { PublicGuard } from '@auth/auth.guard';

@Controller('user')
export class UserController {
    logger = new Logger(UserController.name);
    constructor(private readonly userService: UserService) {}

    @UseGuards(PublicGuard)
    @Get('/:username')
    async getUser(
        @reqUser() user: User,
        @Param('username') username: string,
    ) {
        const targetUser = await this.userService.getProfileByUsername(username);

        if (!targetUser)
            throw new NotFoundException('존재하지 않는 유저입니다.');

        return targetUser;
    }
}
