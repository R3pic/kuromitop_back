import { Injectable } from '@nestjs/common';
import { UUID } from 'crypto';

import { BundleRepository } from './bundle.repository';
import { CreateBundleDto } from './dto/create-bundle.dto';
import { UpdateBundleDto } from './dto/update-bundle.dto';

import { User } from '@user/entities/user.entity';
import { UserService } from '@user/user.service';
import { MusicService } from '@music/music.service';
import { BundleServiceException } from './exception';
import { AddMusicToBundleDto } from './dto/add-music-to-bundle.dto';

@Injectable()
export class BundleService {
    constructor(
        private readonly bundleRepository: BundleRepository,
        private readonly userService: UserService,
        private readonly musicService: MusicService,
    ) {}

    async isExist(uuid: UUID) {
        const { exists } = await this.bundleRepository.isExist(uuid);

        if (!exists) {
            throw BundleServiceException.BUNDLE_NOT_FOUND;
        }
    }

    async checkOwner(uuid: UUID, user: User) {
        const bundle = await this.findOnebyUUID(uuid);

        if (bundle.user_no !== user.user_no)
            throw BundleServiceException.BUNDLE_FORBIDDEN;
    }

    async create(createBundleDto: CreateBundleDto, user: User) {
        return await this.bundleRepository.create(createBundleDto, user);
    }

    async addMusicToBundle(uuid: UUID, addMusicToBundleDto: AddMusicToBundleDto, user: User) {
        await this.checkOwner(uuid, user);

        await this.musicService.createBundleMusic(addMusicToBundleDto, uuid);
    }

    async findManyMusicByBundle(uuid: UUID, user: User) {
        const bundle = await this.findOnebyUUID(uuid);

        if (bundle.is_private && bundle.user_no !== user.user_no)
            throw BundleServiceException.BUNDLE_FORBIDDEN;

        const bundleMusics = this.musicService.findManyByBundleUUID(uuid);

        return bundleMusics;
    }

    async findMany(username: string, user: User) {
        const targetuser = await this.userService.getByUsername(username);

        const bundles = await this.bundleRepository.findManyByUser(targetuser);

        if (!bundles) {
            throw BundleServiceException.BUNDLE_NOT_FOUND;
        }

        return bundles.filter((bundle) => {
            if (bundle.is_private) {
                if (!user || user.username !== username)
                    return false;
            }
        
            return true;
        });
    }

    async findOnebyUUID(uuid: UUID) {
        const bundle = await this.bundleRepository.fineOneByUUID(uuid);

        if (!bundle) {
            throw BundleServiceException.BUNDLE_NOT_FOUND;
        }

        return bundle;
    }

    async update(uuid: UUID, updateBundleDto: UpdateBundleDto, user: User) {
        await this.checkOwner(uuid, user);

        return await this.bundleRepository.update(uuid, updateBundleDto);
    }

    async remove(uuid: UUID, user: User) {
        await this.checkOwner(uuid, user);

        return await this.bundleRepository.remove(uuid);
    }
}
