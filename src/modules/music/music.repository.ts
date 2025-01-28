import { Injectable, Logger } from '@nestjs/common';
import { DatabaseError } from 'pg';

import { PostgresService } from '@common/database/postgres.service';
import { ExistsResult } from '@common/database/types';

import { CreateMusicDto } from './dto/create-music.dto';
import { UUID } from 'crypto';
import { MusicInfo } from './entities/music-info.entity';
import { BundleMusic } from './entities/bundle-music.entity';

@Injectable()
export class MusicRepository {
    private readonly logger = new Logger(MusicRepository.name);

    constructor(
        private readonly pool: PostgresService,
    ) {}

    async create(musicId: number, bundleId: UUID) {
        const client = await this.pool.getClient();
        
        try {
            const query = `
                    INSERT INTO music.bundle_music (music_id, bundle_id)
                    VALUES ($1, $2)
                    `;
        
            await client.query('BEGIN');
            const result = await client.query(query, [
                musicId,
                bundleId,
            ]);
            await client.query('COMMIT');
        
            return result.rowCount || 0;
        } catch (e) {
            if (e instanceof DatabaseError) {
                await client.query('ROLLBACK');
                this.logger.error(e.message, e.stack);
            }
            throw e;
        } finally {
            client.release();
        }
    }

    async createInfo(createMusicDto: CreateMusicDto) {
        const client = await this.pool.getClient();
        
        try {
            const query = `
                    INSERT INTO music.info (external_url, title, artist, thumbnail)
                    VALUES ($1, $2, $3, $4)
                    RETURNING music_id
                    `;
        
            await client.query('BEGIN');
            const result = await client.query<Pick<MusicInfo, 'music_id'>>(query, [
                createMusicDto.external_url,
                createMusicDto.title,
                createMusicDto.artist,
                createMusicDto.thumbnail,
            ]);
            await client.query('COMMIT');
        
            return result.rows[0];
        } catch (e) {
            if (e instanceof DatabaseError) {
                await client.query('ROLLBACK');
                this.logger.error(e.message);
            }
            throw e;
        } finally {
            client.release();
        }
    }

    async isExistByExternalId(externalId: string): Promise<ExistsResult> {
        const client = await this.pool.getClient();

        try {
            const query = 'SELECT EXISTS(SELECT 1 FROM music.info WHERE external_url = $1)';;
            const result = await client.query<ExistsResult>(query, [externalId]);
            return result.rows[0];
        } finally {
            client.release();
        }
    }

    async findMusicIdByExternalId(externalId: string): Promise<Pick<MusicInfo, 'music_id'> | null> {
        const client = await this.pool.getClient();

        try {
            const query = `
            SELECT music_id
            FROM music.info
            WHERE external_url = $1
            `;
            const result = await client.query<Pick<MusicInfo, 'music_id'>>(query, [externalId]);
            return result.rows[0] || null;
        } finally {
            client.release();
        }
    }

    async findManyBundleMusicByBundleUUID(uuid: UUID) {
        const client = await this.pool.getClient();

        try {
            const query = `
            SELECT BundleMusic.bundle_music_pk, MusicInfo.external_url, MusicInfo.title, MusicInfo.artist, MusicInfo.thumbnail
            FROM music.info MusicInfo, music.bundle_music BundleMusic
            WHERE MusicInfo.music_id = BundleMusic.music_id
            AND BundleMusic.bundle_id = $1
            `;
            const result = await client.query<BundleMusic>(query, [uuid]);
            return result.rows || null;
        } finally {
            client.release();
        }
    }

    async remove(bundleMusicId: number) {
        const client = await this.pool.getClient();

        try {
            const query = `
            DELETE
            FROM music.bundle_music
            WHERE bundle_music_pk
            `;
            const result = await client.query(query, [bundleMusicId]);
            return result.rowCount || 0;
        } finally {
            client.release();
        }
    }
}