import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { ClsModule } from 'nestjs-cls';
import { getTransactionHostToken, TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPgPromise } from '@nestjs-cls/transactional-adapter-pg-promise';

import { clsModuleOptions } from '@common/config/cls-module.config';
import { configModuleOptions } from '@common/env/env.config';
import { PostgresModule } from '@common/database/postgres.module';

import { CommentsRepository } from './comments.repository';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment-dto';

describe('CommentsRepository', () => {
    let repository: CommentsRepository;
    let txHost: TransactionHost<TransactionalAdapterPgPromise>;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot(configModuleOptions),
                PostgresModule,
                ClsModule.forRoot(clsModuleOptions),
            ],
            providers: [CommentsRepository],
        }).compile();

        repository = module.get<CommentsRepository>(CommentsRepository);
        txHost = module.get<TransactionHost<TransactionalAdapterPgPromise>>(getTransactionHostToken());
    });

    beforeEach(async () => {
        await txHost.tx.query('BEGIN');
    });

    afterEach(async () => {
        await txHost.tx.query('ROLLBACK');
        await txHost.tx.query('ALTER SEQUENCE member.comment_comment_id_seq RESTART WITH 4');
    });

    afterAll(async () => {
        await txHost.tx.$pool.end();
    });

    describe('checkOwnerByCommentId', () => {
        it('코멘트와 user_no가 동일할 경우 true를 반환한다.', async () => {
            const commentId = 1;
            const userNo = 1;

            const expected = true;

            const actual = await repository.checkOwnerByCommentId(commentId, userNo);

            expect(actual).toEqual(expected);
        });

        it('코멘트와 user_no가 다를 경우 false를 반환한다.', async () => {
            const commentId = 1;
            const userNo = 2;

            const expected = false;

            const actual = await repository.checkOwnerByCommentId(commentId, userNo);

            expect(actual).toEqual(expected);
        });
    });

    describe('create', () => {
        it('코멘트를 생성한다.', async () => {
            const createCommentDto: CreateCommentDto = {
                bundle_music_fk: 1,
                comment: '새로운 코멘트',
            };

            const expected: Omit<Comment, 'created_at'> = {
                comment_id: 4,
                comment: '새로운 코멘트',
            };

            const actual = await repository.create(createCommentDto);

            expect(actual.comment_id).toBe(expected.comment_id);
            expect(actual.comment).toBe(expected.comment);
        });
    });

    describe('findManyByBundleMusicId', () => {
        it('코멘트 목록을 반환한다.', async () => {
            const bundleMusicId = 1;

            const expected: Omit<Comment, 'created_at'>[] = [
                {
                    'comment': '노래가 좋다',
                    'comment_id': 1,
                },
                {
                    'comment': '노래가 참 좋다',
                    'comment_id': 2,
                },
            ];

            const actual = await repository.findManyByBundleMusicId(bundleMusicId);

            expect(actual).toMatchObject(expected);
        });

        it('코멘트 목록이 없더라도 빈배열을 반환한다.', async () => {
            const bundleMusicId = 2;

            const expected: Comment[] = [];

            const actual = await repository.findManyByBundleMusicId(bundleMusicId);

            expect(actual).toEqual(expected);
        });
    });

    describe('remove', () => {
        it('코멘트를 삭제한다.', async () => {
            const commentId = 1;

            const expected: Omit<Comment, 'created_at'> ={
                comment_id: 1,
                comment: '노래가 좋다',
            };

            const actual = await repository.remove(commentId);

            expect(actual).toMatchObject(expected);
        });
    });
});
