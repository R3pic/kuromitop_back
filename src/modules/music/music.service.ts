import { Injectable, Logger } from '@nestjs/common';
import { UUID } from 'crypto';
import { MusicRepository } from './music.repository';
import { PostgresError } from 'pg-error-enum';
import { isDataBaseError } from '@common/exception/utils';
import { MusicServiceExeception } from './exception';
import { CreateMusicDto } from './dto/create-music.dto';
import { User } from '@user/entities/user.entity';

@Injectable()
export class MusicService {
    private readonly logger = new Logger(MusicService.name);
    
    constructor(
        private readonly musicRepository: MusicRepository,
    ) {}

    async createBundleMusic(createMusicDto: CreateMusicDto, uuid: UUID) {
        try {
            const musicId = await this.createInfoIfNotExists(createMusicDto);
            await this.musicRepository.create(musicId, uuid);
        } catch (e) {
            if (isDataBaseError(e)
                && e.code === PostgresError.UNIQUE_VIOLATION
            )
                throw MusicServiceExeception.MusicAlreadyInBundle;
            throw e;
        }
    }

    async findManyByBundleUUID(uuid: UUID) {
        const bundlemusics = this.musicRepository.findManyBundleMusicByBundleUUID(uuid);
        return bundlemusics;
    }

    findManyRecent(user: User) {
        throw new Error(`${JSON.stringify(user)} Method not Implemnted`);
    }

    async remove(bundleMusicId: number) {
        await this.musicRepository.remove(bundleMusicId);
    }

    async createInfoIfNotExists(createMusicDto: CreateMusicDto) {
        let result = await this.musicRepository.findMusicIdByExternalId(createMusicDto.external_url);

        if (result === null) {
            this.logger.debug(`등록되지 않은 음악. 새로 추가합니다. ${JSON.stringify(createMusicDto, null, 2)}`);
            result = await this.musicRepository.createInfo(createMusicDto);
        }

        return result.music_id;
    }

    async checkOwnerBybundleMusicId(bundleMusicId: number, user: User) {
        const { is_owner } = await this.musicRepository.checkOwnerBybundleMusicId(bundleMusicId, user);
        return is_owner;
    }
}
