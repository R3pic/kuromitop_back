import { Test, TestingModule } from '@nestjs/testing';
import { TransactionHost } from '@nestjs-cls/transactional';
import { mock, MockProxy } from 'jest-mock-extended';

import { getMockTransactionHost } from '@test/mockTransactionHost';
import { TrackService } from '@tracks/track.service';
import { MusicServiceExeception } from 'src/modules/tracks/track.errors';
import { LoginType, User } from '@user/domain/entities/user.entity';

import { CommentsService } from './comments.service';
import { CommentsRepository } from './comments.repository';
import { CreateCommentDto } from './domain/dto/create-comment.dto';
import { CommentEntity } from './domain/entities/comment.entity';
import { CommentForbiddenExeception } from './exceptions/comment-forbidden.error';

describe('CommentsService', () => {
    let service: CommentsService;
    let mockRepository: MockProxy<CommentsRepository>;
    let mockMusicService: MockProxy<TrackService>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CommentsService,
                CommentsRepository,
                TrackService,
                {
                    provide: TransactionHost,
                    useValue: getMockTransactionHost(),
                },
            ],
        })
            .overrideProvider(CommentsRepository)
            .useValue(mock<CommentsRepository>())
            .overrideProvider(TrackService)
            .useValue(mock<TrackService>())
            .compile();

        service = module.get(CommentsService);
        mockRepository = module.get(CommentsRepository);
        mockMusicService = module.get(TrackService);
    });

    describe('create', () => {
        it('권한이 존재한다면 코멘트를 추가한다.', async () => {
            const bundle_music_fk = 1;
            const comment = '댓글';
            
            const createCommentDto: CreateCommentDto = {
                bundle_music_fk,
                content: comment,
            };
            
            const user = User.of(1, 'User', LoginType.JWT);

            const comment_id = 1;
            
            const expected: CommentEntity = {
                comment_id,
                comment,
                created_at: new Date(),
            };
            
            mockRepository.create.mockResolvedValue(expected);

            const actual = await service.create(createCommentDto, user);

            expect(actual).toEqual(expected);
            expect(mockMusicService.checkOwnerBybundleMusicId).toHaveBeenCalled();
        });

        it('권한이 존재하지 않는다면 MusicForbiddenException을을 발생시킨다.', async () => {
            const bundle_music_fk = 1;
            const comment = '댓글';
            
            const createCommentDto: CreateCommentDto = {
                bundle_music_fk,
                content: comment,
            };
            
            const user = User.of(1, 'User', LoginType.JWT);
            
            const expected = MusicServiceExeception.FORBIDDEN;

            mockMusicService.checkOwnerBybundleMusicId.mockRejectedValue(MusicServiceExeception.FORBIDDEN);

            const method = async () => await service.create(createCommentDto, user);

            await expect(method()).rejects.toThrow(expected);
        });
    });

    describe('findManyByBundleMusicId', () => {
        it('꾸러미 음악의 소유자가 동일할 경우 코멘트 목록을 반환한다.', async () => {
            const bundle_music_fk = 1;
            const comment = '댓글';
            
            const user = User.of(1, 'User', LoginType.JWT);

            const comment_id = 1;
            
            const expected: CommentEntity[] = [
                {
                    comment_id,
                    comment,
                    created_at: new Date(),
                },
            ];
            
            mockRepository.findManyByBundleMusicId.mockResolvedValue(expected);

            const actual = await service.findManyByBundleMusicId(bundle_music_fk, user);

            expect(actual).toEqual(expected);
            expect(mockMusicService.checkOwnerBybundleMusicId).toHaveBeenCalled();
        });

        it('꾸러미 음악의 소유자가 다를 경우 MusicForbiddenException을 발생시킨다.', async () => {
            const bundle_music_fk = 1;
            
            const user = User.of(1, 'User', LoginType.JWT);
            
            const expected = MusicServiceExeception.FORBIDDEN;

            mockMusicService.checkOwnerBybundleMusicId.mockRejectedValue(MusicServiceExeception.FORBIDDEN);

            const method = async () => await service.findManyByBundleMusicId(bundle_music_fk, user);

            await expect(method()).rejects.toThrow(expected);
        });
    });

    describe('checkOwner', () => {
        it('코멘트 소유자가 동일할 경우 정상 동작한다.', async () => {
            const comment_id = 1;

            const user = User.of(1, 'User', LoginType.JWT);

            mockRepository.checkOwnerByCommentId.mockResolvedValue(true);

            const method = async () => await service.checkOwner(comment_id, user);

            await expect(method()).resolves.not.toThrow();
            expect(mockRepository.checkOwnerByCommentId).toHaveBeenCalled();
        });

        it('코멘트 소유자가 다를 경우 CommentForbiddenExeception을 발생시킨다.', async () => {
            const bundleMusicId = 1;

            const user = User.of(1, 'User', LoginType.JWT);

            const expected = CommentForbiddenExeception;

            mockRepository.checkOwnerByCommentId.mockResolvedValue(false);

            const method = async () => await service.checkOwner(bundleMusicId, user);

            await expect(method()).rejects.toThrow(expected);
            expect(mockRepository.checkOwnerByCommentId).toHaveBeenCalled();
        });
    });

    describe('remove', () => {
        it('꾸러미 음악의 소유자가 동일할 경우 삭제한다.', async () => {
            const comment_id = 1;
            const comment = '댓글';

            const user = User.of(1, 'User', LoginType.JWT);

            const expected: CommentEntity = {
                comment_id,
                comment,
                created_at: new Date(),
            };

            mockRepository.checkOwnerByCommentId.mockResolvedValue(true);
            mockRepository.remove.mockResolvedValue(expected);

            const actual = await service.remove(comment_id, user);

            expect(actual).toEqual(expected);
            expect(mockRepository.checkOwnerByCommentId).toHaveBeenCalled();
        });

        it('꾸러미 음악의 소유자가 다를 경우 CommentForbiddenException을 발생시킨다.', async () => {
            const bundleMusicId = 1;

            const user = User.of(1, 'User', LoginType.JWT);

            const expected = CommentForbiddenExeception;

            mockRepository.checkOwnerByCommentId.mockResolvedValue(false);

            const method = async () => await service.remove(bundleMusicId, user);

            await expect(method()).rejects.toThrow(expected);
            expect(mockRepository.checkOwnerByCommentId).toHaveBeenCalled();
        });
    });
});
