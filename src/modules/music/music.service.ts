import { Injectable, Logger } from '@nestjs/common';
import { CreateMusicDto } from './dto/create-music.dto';
import { UUID } from 'crypto';
import { BundleService } from '@bundle/bundle.service';
import { MusicRepository } from './music.repository';
import { User } from '@user/entities/user.entity';
import { PostgresError } from 'pg-error-enum';
import { isDataBaseError } from '@common/exception/utils';
import { MusicServiceExeception } from './exception';

@Injectable()
export class MusicService {
    private readonly logger = new Logger(MusicService.name);
    
    constructor(
        private readonly musicRepository: MusicRepository,
        private readonly bundleService: BundleService,
    ) {}

    async createBundleMusic(createMusicDto: CreateMusicDto, uuid: UUID, user: User) {
        try {
            const musicId = await this.createInfoIfNotExists(createMusicDto);
            await this.bundleService.checkOwner(uuid, user);
            await this.musicRepository.create(musicId, uuid);
        } catch (e) {
            if (isDataBaseError(e)
                && e.code === PostgresError.UNIQUE_VIOLATION
            )
                throw MusicServiceExeception.MusicAlreadyInBundle;
            throw e;
        }
    }

    async findManyByBundle(uuid: UUID, user: User) {
        await this.bundleService.isExist(uuid);
        await this.bundleService.checkOwner(uuid, user);

        const bundlemusics = this.musicRepository.findManyBundleMusicByBundleUUID(uuid);

        return bundlemusics;
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
}
