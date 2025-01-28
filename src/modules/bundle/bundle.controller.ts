import {
    Controller, Get, Post, Body, Patch, Delete,
    UseGuards,
    HttpCode,
    HttpStatus,
    Param, 
} from '@nestjs/common';
import { BundleService } from './bundle.service';
import { CreateBundleDto } from './dto/create-bundle.dto';
import { UpdateBundleDto } from './dto/update-bundle.dto';
import { UUID } from 'crypto';
import { UUIDParam } from '@common/decorator/UUIDParam.decorator';
import { JwtAuthGuard, OptionalAuthGuard } from '@auth/auth.guard';
import { reqUser } from '@auth/auth.decorator';
import { User } from '@user/entities/user.entity';

@Controller('bundle')
export class BundleController {
    constructor(private readonly bundleService: BundleService) {}

    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.CREATED)
    @Post()
    create(
        @Body() createBundleDto: CreateBundleDto,
        @reqUser() user: User,
    ) {
        return this.bundleService.create(createBundleDto, user);
    }

    @UseGuards(OptionalAuthGuard)
    @HttpCode(HttpStatus.OK)
    @Get(':username')
    findOne(
        @Param('username') username: string,
        @reqUser() user: User
    ) {
        return this.bundleService.findMany(username, user);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':uuid')
    @HttpCode(HttpStatus.OK)
    update(
        @UUIDParam('uuid') uuid: UUID, 
        @Body() updateBundleDto: UpdateBundleDto,
        @reqUser() user: User,
    ) {
        return this.bundleService.update(uuid, updateBundleDto, user);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':uuid')
    @HttpCode(HttpStatus.OK)
    remove(@UUIDParam('uuid') uuid: UUID) {
        return this.bundleService.remove(uuid, user);
    }
}
