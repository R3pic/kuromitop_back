import { Injectable } from '@nestjs/common';
import { UUID } from 'crypto';

import { BundleRepository } from './bundle.repository';
import { CreateBundleDto } from './dto/create-bundle.dto';
import { UpdateBundleDto } from './dto/update-bundle.dto';

import { User } from '@user/entities/user.entity';
import { MusicService } from '@music/music.service';
import { BundleServiceException } from './exception';
import { AddMusicToBundleDto } from './dto/add-music-to-bundle.dto';
import { Transactional } from '@nestjs-cls/transactional';

@Injectable()
export class BundleService {
    constructor(
        private readonly bundleRepository: BundleRepository,
        private readonly musicService: MusicService,
    ) {}

    async checkOwner(uuid: UUID, user: User) {
        const bundle = await this.findOneByUUID(uuid);

        if (bundle.user_no !== user.user_no)
            throw BundleServiceException.BUNDLE_FORBIDDEN;
    }

    @Transactional()
    async create(createBundleDto: CreateBundleDto, user: User) {
        const bundle = await this.bundleRepository.create(createBundleDto, user.user_no);
        return bundle;
    }

    @Transactional()
    async addMusicToBundle(uuid: UUID, addMusicToBundleDto: AddMusicToBundleDto, user: User) {
        await this.checkOwner(uuid, user);

        return await this.musicService.createBundleMusic(addMusicToBundleDto, uuid);
    }

    async findManyBundleMusicByBundle(uuid: UUID, user: User) {
        await this.checkOwner(uuid, user);

        const bundleMusics = await this.bundleRepository.findManyBundleMusicItemByBundleUUID(uuid);

        return bundleMusics;
    }

    async findMany(username: string, user: User) {
        const bundles = await this.bundleRepository.findManyByUsername(username);

        return bundles.filter((bundle) => {
            if (bundle.is_private) {
                if (!user || user.username !== username)
                    return false;
            }
        
            return true;
        });
    }

    async findOneByUUID(uuid: UUID) {
        const bundle = await this.bundleRepository.findOneByUUID(uuid);

        if (!bundle) {
            throw BundleServiceException.BUNDLE_NOT_FOUND;
        }

        return bundle;
    }

    @Transactional()
    async update(uuid: UUID, updateBundleDto: UpdateBundleDto, user: User) {
        await this.checkOwner(uuid, user);

        return await this.bundleRepository.update(uuid, updateBundleDto);
    }

    @Transactional()
    async remove(uuid: UUID, user: User) {
        await this.checkOwner(uuid, user);

        return await this.bundleRepository.remove(uuid);
    }
}
