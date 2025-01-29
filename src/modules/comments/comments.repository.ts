import { PostgresService } from '@common/database/postgres.service';
import { CreateCommentDto } from './dto/create-comment-dto';
import { DatabaseError } from 'pg';
import { Injectable, Logger } from '@nestjs/common';
import { Comment } from './entities/comment.entity';
import { User } from '@user/entities/user.entity';
import { IsOwnerResult } from '@common/database/repository-result';

@Injectable()
export class CommentsRepository {
    private readonly logger = new Logger(CommentsRepository.name);

    constructor(
        private readonly pool: PostgresService
    ) {}

    async checkOwnerByCommentId(commentId: number, user: User) {
        const client = await this.pool.getClient();
        
        try {
            const query = `
            SELECT
                CASE WHEN Bundle.user_no = $1 THEN TRUE ELSE FALSE END AS is_owner
            FROM member.comment Comment, music.bundle_music BundleMusic, member.bundle Bundle
            WHERE BundleMusic.bundle_id = Bundle.uuid
            AND BundleMusic.bundle_music_pk = Comment.bundle_music_fk
            AND Comment.comment_id = $2
            `;
            const result = await client.query<IsOwnerResult>(query, [ 
                user.user_no,
                commentId,
            ]);
            return result.rows[0] || null;
        } finally {
            client.release();
        }
    }

    async findManyByBundleMusicId(bundleMusicId: number): Promise<Comment[] | null> {
        const client = await this.pool.getClient();

        try {
            const query = `
            SELECT comment_id, comment, create_at
            FROM member.comment
            WHERE bundle_music_fk = $1
            `;
            const result = await client.query<Comment>(query, [bundleMusicId]);
            return result.rows || null;
        } finally {
            client.release();
        }
    }

    async create(createCommentDto: CreateCommentDto) {
        const client = await this.pool.getClient();

        try {
            const query = `
            INSERT INTO member.comment (bundle_music_fk, comment)
            VALUES ($1, $2)
            RETURNING comment_id, comment, create_at
            `;

            await client.query('BEGIN');
            const result = await client.query<Comment>(query, [
                createCommentDto.bundle_music_fk,
                createCommentDto.comment,
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

    async remove(commentId: number) {
        const client = await this.pool.getClient();

        try {
            const query = `
            DELETE
            FROM member.comment
            WHERE comment_id = $1
            `;

            await client.query('BEGIN');
            const result = await client.query(query, [commentId]);
            await client.query('COMMIT');

            return result.rowCount || 0;
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
}