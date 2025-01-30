import { Injectable, Logger } from '@nestjs/common';
import { Transactional } from '@nestjs-cls/transactional';
import { PostgresError } from 'pg-error-enum';
import { UUID } from 'crypto';

import { isDataBaseError } from '@common/exception/utils';
import { User } from '@user/entities/user.entity';

import { MusicRepository } from './music.repository';
import { MusicServiceExeception } from './exceptions';

import { CreateMusicDto } from './dto/create-music.dto';

@Injectable()
export class MusicService {
    private readonly logger = new Logger(MusicService.name);
    
    constructor(
        private readonly musicRepository: MusicRepository,
    ) {}

    @Transactional()
    async createBundleMusic(createMusicDto: CreateMusicDto, uuid: UUID) {
        try {
            let musicId = await this.musicRepository.findMusicIdByExternalUrl(createMusicDto.external_url);

            if (musicId === null) {
                this.logger.debug(`등록되지 않은 음악. 새로 추가합니다. ${JSON.stringify(createMusicDto, null, 2)}`);
                musicId = await this.musicRepository.createMusicInfo(createMusicDto);
            }

            return await this.musicRepository.createBundleMusic(musicId, uuid);
        } catch (e) {
            if (isDataBaseError(e)
                && e.code === PostgresError.UNIQUE_VIOLATION
            )
                throw MusicServiceExeception.MUSIC_ALREADY_IN_BUNDLE;
            throw e;
        }
    }

    @Transactional()
    async remove(bundleMusicId: number, user: User) {
        await this.checkOwnerBybundleMusicId(bundleMusicId, user);

        return await this.musicRepository.remove(bundleMusicId);
    }

    async checkOwnerBybundleMusicId(bundleMusicId: number, user: User) {
        const isOwner = await this.musicRepository.checkOwnerBybundleMusicId(bundleMusicId, user.user_no);

        if (!isOwner)
            throw MusicServiceExeception.FORBIDDEN;
    }
    
    findManyRecent(user: User) {
        throw new Error(`${JSON.stringify(user)} Method not Implemnted`);
    }
}
