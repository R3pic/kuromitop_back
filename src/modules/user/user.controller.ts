import {
    Body,
    Controller, Get, Logger, Param, Patch, UseGuards, 
} from '@nestjs/common';

import { ReqUser } from '@common/decorator/req-user.decorator';
import { JwtAuthGuard, OptionalAuthGuard } from '@common/guard/auth.guard';

import { UserService } from './user.service';
import { RequestUser } from '@common/request-user';
import { routes } from '@common/config/routes';
import { UpdateProfileDto } from './domain/dto/update-profile.dto';

@Controller(routes.user.root)
export class UserController {
    logger = new Logger(UserController.name);
    constructor(private readonly userService: UserService) {}

    @UseGuards(OptionalAuthGuard)
    @Get(routes.user.profile)
    async getUser(
        @ReqUser() reqUser: RequestUser,
        @Param('username') username: string,
    ) {
        return await this.userService.findProfileByUsername(username, reqUser);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(routes.user.me)
    async updateProfile(
        @ReqUser() reqUser: RequestUser,
        @Body() updateProfileDto: UpdateProfileDto
    ) {
        return await this.userService.updateProfile(updateProfileDto, reqUser);
    }
}
