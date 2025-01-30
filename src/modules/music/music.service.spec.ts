import { Test, TestingModule } from '@nestjs/testing';
import { MusicService } from './music.service';
import { mock, MockProxy } from 'jest-mock-extended';
import { MusicRepository } from './music.repository';
import { TransactionHost } from '@nestjs-cls/transactional';
import { getMockTransactionHost } from '@test/mockTransactionHost';
import { CreateMusicDto } from './dto/create-music.dto';
import { BundleMusic } from './entities/bundle-music.entity';
import { UUID } from 'crypto';
import { MusicAlreadyInBundleException } from './exceptions/music-already-in-bundle.error';
import { DatabaseError } from 'pg';
import { PostgresError } from 'pg-error-enum';
import { LoginType, User } from '@user/entities/user.entity';
import { MusicForbiddenException } from './exceptions/music-forbidden.error';

describe('MusicService', () => {
    let service: MusicService;
    let mockRepository: MockProxy<MusicRepository>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                MusicService,
                MusicRepository,
                {
                    provide: TransactionHost,
                    useValue: getMockTransactionHost(),
                },
            ],
        })
            .overrideProvider(MusicRepository)
            .useValue(mock<MusicRepository>())
            .compile();

        service = module.get<MusicService>(MusicService);
        mockRepository = module.get(MusicRepository);
    });

    describe('createBundleMusic', () => {
        it('기존에 정보가 존재하는 음악을 꾸러미에 생성 한다.', async () => {
            const createMusicDto: CreateMusicDto = {
                external_url: 'externalurl',
                title: 'title',
                artist: 'artist',
                thumbnail: 'thumnail',
            };

            const music_id = 1;
            const bundle_music_pk = 1;
            const bundle_id: UUID = 'uuid' as UUID;

            const expected: BundleMusic = {
                bundle_music_pk,
                bundle_id,
                music_id,
                create_at: new Date(),
            };

            mockRepository.findMusicIdByExternalUrl.mockResolvedValue(music_id);
            mockRepository.createBundleMusic.mockResolvedValue(expected);

            const actual = await service.createBundleMusic(createMusicDto, bundle_id);

            expect(actual).toEqual(expected);
            expect(mockRepository.createMusicInfo).not.toHaveBeenCalled();
        });

        it('완전히 새로운 음악이라면 정보를 생성한 후 꾸러미에 생성한다.', async () => {
            const createMusicDto: CreateMusicDto = {
                external_url: 'externalurl',
                title: 'title',
                artist: 'artist',
                thumbnail: 'thumnail',
            };

            const music_id = 1;
            const bundle_music_pk = 1;
            const bundle_id: UUID = 'uuid' as UUID;

            const expected: BundleMusic = {
                bundle_music_pk,
                bundle_id,
                music_id,
                create_at: new Date(),
            };

            mockRepository.findMusicIdByExternalUrl.mockResolvedValue(null);
            mockRepository.createMusicInfo.mockResolvedValue(music_id);
            mockRepository.createBundleMusic.mockResolvedValue(expected);

            const actual = await service.createBundleMusic(createMusicDto, bundle_id);

            expect(actual).toEqual(expected);
            expect(mockRepository.createMusicInfo).toHaveBeenCalled();
        });

        it('UNIQUE_VIOLATION이 발생할 경우 MusicAlreadyInBundleException을 발생시킨다.', async () => {
            const createMusicDto: CreateMusicDto = {
                external_url: 'externalurl',
                title: 'title',
                artist: 'artist',
                thumbnail: 'thumnail',
            };

            const music_id = 1;
            const bundle_id: UUID = 'uuid' as UUID;

            const exception = new DatabaseError('', 0, 'error');
            exception.code = PostgresError.UNIQUE_VIOLATION;

            const expected = MusicAlreadyInBundleException;

            mockRepository.findMusicIdByExternalUrl.mockResolvedValue(music_id);
            mockRepository.createBundleMusic.mockRejectedValue(exception);

            const method = async () => await service.createBundleMusic(createMusicDto, bundle_id);

            await expect(method()).rejects.toThrow(expected);
        });
    });

    describe('checkOwnerByBundleMusicId', () => {
        it('꾸러미 음악의 소유자가 동일할 경우 정상 실행한다.', async () => {
            const bundleMusicId = 1;

            const user = User.of(1, 'User', LoginType.JWT);

            mockRepository.checkOwnerBybundleMusicId.mockResolvedValue(true);

            const method = async () => await service.checkOwnerBybundleMusicId(bundleMusicId, user);

            await expect(method()).resolves.not.toThrow();
            expect(mockRepository.checkOwnerBybundleMusicId).toHaveBeenCalled();
        });

        it('꾸러미 음악의 소유자가 다를 경우 UserForbiddenException을 발생시킨다.', async () => {
            const bundleMusicId = 1;

            const user = User.of(1, 'User', LoginType.JWT);

            const expected = MusicForbiddenException;

            mockRepository.checkOwnerBybundleMusicId.mockResolvedValue(false);

            const method = async () => await service.checkOwnerBybundleMusicId(bundleMusicId, user);

            await expect(method()).rejects.toThrow(expected);
            expect(mockRepository.checkOwnerBybundleMusicId).toHaveBeenCalled();
        });
    });

    describe('remove', () => {
        it('꾸러미 음악의 소유자가 동일할 경우 삭제한다.', async () => {
            const bundleMusicId = 1;
            const music_id = 1;
            const bundle_music_pk = 1;
            const bundle_id: UUID = 'uuid' as UUID;

            const user = User.of(1, 'User', LoginType.JWT);

            const expected: BundleMusic = {
                bundle_music_pk,
                bundle_id,
                music_id,
                create_at: new Date(),
            };

            mockRepository.checkOwnerBybundleMusicId.mockResolvedValue(true);
            mockRepository.remove.mockResolvedValue(expected);

            const actual = await service.remove(bundleMusicId, user);

            expect(actual).toEqual(expected);
            expect(mockRepository.checkOwnerBybundleMusicId).toHaveBeenCalled();
        });

        it('꾸러미 음악의 소유자가 다를 경우 UserForbiddenException을 발생시킨다.', async () => {
            const bundleMusicId = 1;

            const user = User.of(1, 'User', LoginType.JWT);

            const expected = MusicForbiddenException;

            mockRepository.checkOwnerBybundleMusicId.mockResolvedValue(false);

            const method = async () => await service.remove(bundleMusicId, user);

            await expect(method()).rejects.toThrow(expected);
            expect(mockRepository.checkOwnerBybundleMusicId).toHaveBeenCalled();
        });
    });
});
