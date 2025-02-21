import {
  Body,
  Controller, Get, Logger, Param, Patch, UseGuards,
} from '@nestjs/common';

import { ReqUser } from '@common/decorator/req-user.decorator';
import { JwtAuthGuard, OptionalAuthGuard } from '@common/guard/auth.guard';

import { UserService } from './user.service';
import { RequestUser } from '@common/request-user';
import { routes } from '@common/config/routes';
import { UpdateUserDto } from '@user/dto/update-user.dto';

@Controller(routes.user.root)
export class UserController {
  logger = new Logger(UserController.name);
  constructor(private readonly userService: UserService) {}

  @UseGuards(OptionalAuthGuard)
  @Get(routes.user.profile)
  async getUser(
    @Param('user_id') id: string,
    @ReqUser() reqUser: RequestUser,
  ) {
    return await this.userService.findUserWithBundles(id, reqUser);
  }

  @UseGuards(JwtAuthGuard)
  @Get(routes.user.me)
  async getSelfUser(
    @ReqUser() reqUser: RequestUser
  ) {
    this.logger.log(reqUser);
    const response = await this.userService.findUserWithBundles(reqUser.id, reqUser);
    return response;
  }

  @UseGuards(JwtAuthGuard)
  @Patch(routes.user.me)
  async updateUser(
    @ReqUser() reqUser: RequestUser,
    @Body() updateProfileDto: UpdateUserDto
  ) {
    return await this.userService.update(updateProfileDto, reqUser);
  }
}
