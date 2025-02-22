import {
  Controller, Get, Post, Body, Patch, Delete,
  UseGuards, HttpCode, HttpStatus, Res,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

import { UUIDParam } from '@common/decorator/uuid-Param.decorator';
import { JwtAuthGuard, OptionalAuthGuard } from '@common/guard/auth.guard';
import { ReqUser } from '@common/decorator/req-user.decorator';
import { RequestUser } from '@common/request-user';
import { routes } from '@common/config/routes';

import { BundleService } from './bundle.service';
import { CreateBundleDto } from './domain/dto/create-bundle.dto';
import { CreateBundleBody } from './domain/dto/create-bundle.body';
import { UpdateBundleDto } from './domain/dto/update-bundle.dto';
import { UpdateBundleBody } from './domain/dto/update-bundle.body';
import { RemoveBundleDto } from './domain/dto/delete-bundle.dto';
import { AddTrackBody } from './domain/dto/add-track.body';
import { BundleID } from './domain/model/bundle.model';

@Controller(routes.bundle.root)
export class BundleController {
  private readonly logger = new Logger(BundleController.name);
  constructor(private readonly bundleService: BundleService) {}

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(
    @Body() createBundleBody: CreateBundleBody,
    @ReqUser() reqUser: RequestUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    const createBundleDto = new CreateBundleDto(createBundleBody, reqUser);
    const id = await this.bundleService.create(createBundleDto);

    res.setHeader('Location', routes.bundle.location(id));
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Patch(routes.bundle.detail)
  update(
    @UUIDParam('uuid') bundleID: BundleID, 
    @Body() updateBundleBody: UpdateBundleBody,
    @ReqUser() reqUser: RequestUser,
  ) {
    const updateBundleDto = new UpdateBundleDto(bundleID, updateBundleBody, reqUser);

    return this.bundleService.update(updateBundleDto);
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(routes.bundle.detail)
  async remove(
    @UUIDParam('uuid') bundleID: BundleID,
    @ReqUser() reqUser: RequestUser
  ) {
    const removeBundleDto = new RemoveBundleDto(bundleID, reqUser);

    return await this.bundleService.remove(removeBundleDto);
  }

  @UseGuards(OptionalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get(routes.bundle.tracks.root)
  async findTracksByBundle(
    @UUIDParam('uuid') bundleID: BundleID,
    @ReqUser() reqUser: RequestUser
  ) {
    return await this.bundleService.findTracksByBundle(bundleID, reqUser);
  }

  @UseGuards(JwtAuthGuard)
  @Post(routes.bundle.tracks.root)
  @HttpCode(HttpStatus.OK)
  async addTrackToBundle(
    @UUIDParam('uuid') bundleId: BundleID,
    @Body() addTrackBody: AddTrackBody,
    @ReqUser() reqUser: RequestUser
  ) {
    return await this.bundleService.addTrackToBundle({
      bundleId,
      musicId: addTrackBody.id,
      title: addTrackBody.title,
      artist: addTrackBody.artist,
      thumbnail: addTrackBody.thumbnail,
      reqUser,
    });
  }
}
