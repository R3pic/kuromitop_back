import { Injectable, Logger } from '@nestjs/common';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPgPromise } from '@nestjs-cls/transactional-adapter-pg-promise';

import { IsOwner } from '@common/database/results';

import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment-dto';

@Injectable()
export class CommentsRepository {
    private readonly logger = new Logger(CommentsRepository.name);

    constructor(
        private readonly txHost: TransactionHost<TransactionalAdapterPgPromise>
    ) {}

    async checkOwnerByCommentId(commentId: number, user_no: number) {
        const query = `
            SELECT
                CASE WHEN Bundle.user_no = $1 THEN TRUE ELSE FALSE END AS is_owner
            FROM member.comment Comment, music.bundle_music BundleMusic, member.bundle Bundle
            WHERE BundleMusic.bundle_id = Bundle.uuid
            AND BundleMusic.bundle_music_pk = Comment.bundle_music_fk
            AND Comment.comment_id = $2
            `;
        const result = await this.txHost.tx.one<IsOwner>(query, [ 
            user_no,
            commentId,
        ]);
        return result.is_owner;
    }

    async create(createCommentDto: CreateCommentDto) {
        const query = `
            INSERT INTO member.comment (bundle_music_fk, comment)
            VALUES ($1, $2)
            RETURNING comment_id, comment, create_at
            `;
        const comment = await this.txHost.tx.one<Comment>(query, [
            createCommentDto.bundle_music_fk,
            createCommentDto.comment,
        ]);

        return comment;
    }

    async findManyByBundleMusicId(bundleMusicId: number): Promise<Comment[] | null> {
        const query = `
            SELECT comment_id, comment, create_at
            FROM member.comment
            WHERE bundle_music_fk = $1
            `;
        const comments = await this.txHost.tx.manyOrNone<Comment>(query, [bundleMusicId]);
        return comments;
    }

    async remove(commentId: number) {
        const query = `
            DELETE
            FROM member.comment
            WHERE comment_id = $1
            RETURNING comment_id, comment, create_at
            `;
        const comment = await this.txHost.tx.one<Comment>(query, [commentId]);
        return comment;
    }
}