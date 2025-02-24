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
        
    const result = await this.txHost.tx.one<Pick<BundleTrackModel, 'music_id' | 'bundle_id'>>(query, [
      entity.music_id,
      entity.bundle_id,
    ]);
        
    return result;
  }

  async findById(trackId: number) {
    const query = `
            SELECT BundleTracks.*, Bundle.is_private, Bundle.user_id, Music.title, Music.artist, Music.thumbnail
            FROM music.bundle_tracks BundleTracks, member.bundle Bundle, music.info Music
            WHERE BundleTracks.bundle_id = Bundle.id
            AND BundleTracks.music_id = Music.id
            AND BundleTracks.id = $1
            `;
        
    const result = await this.txHost.tx.oneOrNone<BundleTrackModel>(query, [trackId]);
    return result;
  }

  async remove(entity: TrackEntity) {
    this.logger.log(entity);
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
                    INSERT INTO music.info (id, title, artist, thumbnail)
                    VALUES ($1, $2, $3, $4)
                    RETURNING *
                    `;
        
    const model = await this.txHost.tx.one<MusicModel>(query, [
      entity.id,
      entity.title,
      entity.artist,
      entity.thumbnail,
    ]);
    return model;
  }

  async findMusicById(trackId: string) {
    const query = `
        SELECT *
        FROM music.info
        WHERE id = $1
        `;
    const model = await this.txHost.tx.oneOrNone<MusicModel>(query, [trackId]);
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
                BundleTracks.updated_at
            FROM music.info MusicInfo, music.bundle_tracks BundleTracks
            WHERE BundleTracks.music_id = MusicInfo.id 
            AND BundleTracks.bundle_id = $1
            ORDER BY BundleTracks.id DESC
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
        ORDER BY BundleTracks.id DESC, Comment.created_at DESC, BundleTracks.created_at DESC
        LIMIT 10
        `;
    const tracks = await this.txHost.tx.manyOrNone<TrackModel & { 
      comment_id: number;
      comment_content: string;
      comment_created_at: Date;
      comment_count: number;
    }>(query);
    return tracks;
  }
}