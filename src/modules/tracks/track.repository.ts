import { Injectable, Logger } from '@nestjs/common';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPgPromise } from '@nestjs-cls/transactional-adapter-pg-promise';

import { BundleID } from '@bundle/domain/model/bundle.model';
import { MusicEntity } from './domain/entities/music.entity';
import { TrackEntity } from './domain/entities/track.entity';
import { MusicModel } from './domain/model/music.model';
import { BundleTrackModel } from './domain/model/bundle-track.model';
import { TrackModel } from './domain/model/track.model';

@Injectable()
export class TrackRepository {
    private readonly logger = new Logger(TrackRepository.name);

    constructor(
        private readonly txHost: TransactionHost<TransactionalAdapterPgPromise>
    ) {}

    async create(entity: TrackEntity) {
        const query = `
            INSERT INTO music.bundle_tracks (music_id, bundle_id)
            VALUES ($1, $2)
            RETURNING *
            `;
        
        const result = await this.txHost.tx.one<BundleTrackModel>(query, [
            entity.music_id,
            entity.bundle_id,
        ]);
        
        return result;
    }

    async findById(trackId: number) {
        const query = `
            SELECT BundleTracks.*, Bundle.user_id
            FROM music.bundle_tracks BundleTracks, member.bundle Bundle
            WHERE BundleTracks.bundle_id = Bundle.id
            AND BundleTracks.id = $1
            `;
        
        const result = await this.txHost.tx.oneOrNone<BundleTrackModel & { user_id: number }>(query, [trackId]);
        return result;
    }

    async remove(entity: TrackEntity) {
        const query = `
            DELETE
            FROM music.bundle_tracks
            WHERE id = $1
            RETURNING *
            `;
        const deleted = await this.txHost.tx.oneOrNone<MusicModel>(query, [entity.id]);
        return deleted;
    }

    async createMusic(entity: MusicEntity) {
        const query = `
                    INSERT INTO music.info (title, artist, thumbnail)
                    VALUES ($1, $2, $3)
                    RETURNING *
                    `;
        
        const model = await this.txHost.tx.one<MusicModel>(query, [
            entity.title,
            entity.artist,
            entity.thumbnail,
        ]);
        return model;
    }

    async findMusicById(trackId: number) {
        const query = `
        SELECT *
        FROM music.info
        WHERE id = $1
        `;
        const model = await this.txHost.tx.oneOrNone<MusicModel>(query, [trackId]);
        return model;
    }

    async findMusicByTitle(title: string) {
        const query = `
        SELECT *
        FROM music.info
        WHERE title = $1
        `;
        const model = await this.txHost.tx.oneOrNone<MusicModel>(query, [title]);
        return model;
    }

    async findManyByBundleId(id: BundleID) {
        const query = `
            SELECT DISTINCT ON (BundleTracks.id)
                BundleTracks.id, 
                MusicInfo.title, 
                MusicInfo.artist, 
                MusicInfo.thumbnail, 
                BundleTracks.created_at, 
                BundleTracks.updated_at,
                Comment.id AS comment_id,
                Comment.content AS comment_content,
                Comment.created_at AS comment_created_at,
                COUNT(Comment.id) OVER (PARTITION BY BundleTracks.id) AS comment_count
            FROM music.info MusicInfo, music.bundle_tracks BundleTracks, member.comment Comment
            WHERE BundleTracks.music_id = MusicInfo.id 
            AND BundleTracks.id = Comment.bundle_tracks_fk
            AND BundleTracks.bundle_id = $1
            ORDER BY BundleTracks.id, Comment.created_at DESC
            `;
        const tracks = await this.txHost.tx.manyOrNone<TrackModel>(query, [id]);
        return tracks;
    }

    async findManyRecent() {
        const query = `
        SELECT DISTINCT ON (BundleTracks.id)
            BundleTracks.id,
            MusicInfo.title, 
            MusicInfo.artist, 
            MusicInfo.thumbnail,
            BundleTracks.created_at, 
            BundleTracks.updated_at,
            Comment.id AS comment_id,
            Comment.content AS comment_content,
            Comment.created_at AS comment_created_at,
            COUNT(Comment.id) OVER (PARTITION BY BundleTracks.id) AS comment_count
        FROM music.info MusicInfo, music.bundle_tracks BundleTracks, member.bundle Bundle, member.comment Comment
        WHERE BundleTracks.music_id = MusicInfo.id
        AND BundleTracks.id = Comment.bundle_tracks_fk
        AND BundleTracks.bundle_id = Bundle.id
        AND Bundle.is_private = FALSE
        ORDER BY BundleTracks.id, Comment.created_at DESC, BundleTracks.created_at DESC
        LIMIT 10
        `;
        const tracks = await this.txHost.tx.manyOrNone<TrackModel>(query);
        return tracks;
    }
}