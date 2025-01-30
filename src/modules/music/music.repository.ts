import { Injectable, Logger } from '@nestjs/common';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPgPromise } from '@nestjs-cls/transactional-adapter-pg-promise';
import { UUID } from 'crypto';

import { IsOwner } from '@common/database/results';

import { MusicInfo } from './entities/music-info.entity';
import { BundleMusic } from './entities/bundle-music.entity';
import { CreateMusicDto } from './dto/create-music.dto';

@Injectable()
export class MusicRepository {
    private readonly logger = new Logger(MusicRepository.name);

    constructor(
        private readonly txHost: TransactionHost<TransactionalAdapterPgPromise>
    ) {}

    async checkOwnerBybundleMusicId(bundleMusicId: number, userNo: number) {
        const query = `
            SELECT
                CASE WHEN Bundle.user_no = $1 THEN TRUE ELSE FALSE END AS is_owner
            FROM music.bundle_music BundleMusic, member.bundle Bundle
            WHERE BundleMusic.bundle_id = Bundle.uuid
            AND BundleMusic.bundle_music_pk = $2;
            `;
        const result = await this.txHost.tx.one<IsOwner>(query, [ 
            userNo, 
            bundleMusicId, 
        ]);
        return result.is_owner;
    }

    async createBundleMusic(musicId: number, bundleId: UUID) {
        const query = `
            INSERT INTO music.bundle_music (music_id, bundle_id)
            VALUES ($1, $2)
            RETURNING bundle_music_pk, music_id, bundle_id, create_at
            `;
        
        const result = await this.txHost.tx.one<BundleMusic>(query, [
            musicId,
            bundleId,
        ]);
        
        return result;
    }

    async createMusicInfo(createMusicDto: CreateMusicDto) {
        const query = `
                    INSERT INTO music.info (external_url, title, artist, thumbnail)
                    VALUES ($1, $2, $3, $4)
                    RETURNING music_id
                    `;
        
        const result = await this.txHost.tx.one<Pick<MusicInfo, 'music_id'>>(query, [
            createMusicDto.external_url,
            createMusicDto.title,
            createMusicDto.artist,
            createMusicDto.thumbnail,
        ]);
        
        return result.music_id;
    }

    async findMusicIdByExternalUrl(externalUrl: string) {
        const query = `
        SELECT music_id
        FROM music.info
        WHERE external_url = $1
        `;
        const result = await this.txHost.tx.oneOrNone<Pick<MusicInfo, 'music_id'>>(query, [externalUrl]);
        return result ? result.music_id : null;
    }

    async remove(bundleMusicId: number) {
        const query = `
        DELETE
        FROM music.bundle_music
        WHERE bundle_music_pk = $1
        RETURNING bundle_music_pk, music_id, bundle_id, create_at
        `;
        const deleted = await this.txHost.tx.oneOrNone<BundleMusic>(query, [bundleMusicId]);
        return deleted;
    }
}