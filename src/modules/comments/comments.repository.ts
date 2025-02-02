import { Injectable, Logger } from '@nestjs/common';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPgPromise } from '@nestjs-cls/transactional-adapter-pg-promise';

import { CommentEntity } from './domain/entities/comment.entity';
import { CommentModel } from './domain/model/comment.model';
import { BundleID } from '@bundle/domain/model/bundle.model';

@Injectable()
export class CommentsRepository {
    private readonly logger = new Logger(CommentsRepository.name);

    constructor(
        private readonly txHost: TransactionHost<TransactionalAdapterPgPromise>
    ) {}

    async create(entity: CommentEntity) {
        const query = `
            INSERT INTO member.comment (bundle_tracks_fk, content)
            VALUES ($1, $2)
            RETURNING *
            `;
        const comment = await this.txHost.tx.one<CommentModel>(query, [
            entity.trackId,
            entity.content,
        ]);

        return comment;
    }

    async findById(id: number) {
        const query = `
            SELECT Bundle.user_id, Comment.*
            FROM member.comment Comment, music.bundle_tracks BundleTrack, member.bundle Bundle
            WHERE BundleTrack.id = Comment.bundle_tracks_fk
            AND BundleTrack.bundle_id = Bundle.id
            AND Comment.id = $1
            `;
        const model = await this.txHost.tx.oneOrNone<CommentModel & { user_id: number }>(query, [id]);
        return model;
    }

    async remove(entity: CommentEntity) {
        const query = `
            DELETE
            FROM member.comment
            WHERE id = $1
            RETURNING *
            `;
        const comment = await this.txHost.tx.one<CommentModel>(query, [entity.id]);
        return comment;
    }

    async findPreviewCommensByBunlde(bundleId: BundleID) {
        const query = `
            SELECT DISTINCT ON (BundleTracks.id)
                Comment.*
            FROM music.bundle_tracks BundleTracks, member.comment Comment
            WHERE BundleTracks.id = Comment.bundle_tracks_fk
            AND BundleTracks.bundle_id = $1
            ORDER BY BundleTracks.id, Comment.created_at DESC;
            `;
        const comment = await this.txHost.tx.manyOrNone<CommentModel>(query, [bundleId]);
        return comment;
    }

    async findManyByBundleMusicId(trackId: number) {
        const query = `
            SELECT *
            FROM member.comment
            WHERE bundle_tracks_fk = $1
            `;
        const comments = await this.txHost.tx.manyOrNone<CommentModel>(query, [trackId]);

        return comments;
    }
}