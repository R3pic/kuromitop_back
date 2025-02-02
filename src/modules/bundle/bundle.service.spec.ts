import { Test, TestingModule } from '@nestjs/testing';
import { TransactionHost } from '@nestjs-cls/transactional';
import { mock, MockProxy } from 'jest-mock-extended';
import { UUID } from 'crypto';

import { getMockTransactionHost } from '@test/mockTransactionHost';
import { LoginType, User } from '@user/domain/entities/user.entity';
import { TrackService } from '@tracks/track.service';
import { BundleService } from './bundle.service';
import { BundleRepository } from './bundle.repository';
import { Bundle } from './domain/entities/bundle.entity';
import { BundleNotFoundException } from './exception/bundle-not-found.error';
import { BundleForbiddenException } from './exception/bundle-forbidden.error';
import { CreateBundleDto } from './domain/dto/create-bundle.dto';
import { AddTrackDto } from './domain/dto/add-track.dto';
import { BundleMusic } from '@music/domain/entities/bundle-music.entity';
import { BundleMusicItem } from './domain/entities/bundle-music-item.entity';
import { UpdateBundleDto } from './domain/dto/update-bundle.dto';

describe('BundleService', () => {
    let service: BundleService;
    let mockRepository: MockProxy<BundleRepository>;
    let mockMusicService: MockProxy<TrackService>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                BundleService,
                BundleRepository,
                TrackService,
                {
                    provide: TransactionHost,
                    useValue: getMockTransactionHost(),
                },
            ],
        })
            .overrideProvider(BundleRepository)
            .useValue(mock<BundleRepository>())
            .overrideProvider(TrackService)
            .useValue(mock<TrackService>())
            .compile();

        service = module.get(BundleService);
        mockRepository = module.get(BundleRepository);
        mockMusicService = module.get(TrackService);
    });

    describe('findOneByUUID', () => {
        it('꾸러미가 존재할 경우 반환한다.', async () => {
            const user_no = 1;
            const uuid = 'uuid' as UUID;
            const title = '번들이름';
            const is_private = true;

            const bundle: Bundle = {
                user_no,
                uuid,
                title,
                is_private,
            };

            const expected = bundle;

            mockRepository.findByID.mockResolvedValue(bundle);

            const actual = await service.findOneByUUID(uuid);

            expect(actual).toEqual(expected);
        });

        it('꾸러미가 존재하지 않을 경우 BundleNotFoundException을 발생시킨다.', async () => {
            const uuid = 'uuid' as UUID;

            const expected = BundleNotFoundException;

            mockRepository.findByID.mockResolvedValue(null);

            const method = async () => await service.findOneByUUID(uuid);

            await expect(method()).rejects.toThrow(expected);
        });
    });

    describe('checkOwner', () => {
        it('소유자가 동일할 경우 정상 동작한다.', async () => {
            const user_no = 1;
            const uuid = 'uuid' as UUID;
            const title = '번들이름';
            const is_private = true;
    
            const bundle: Bundle = {
                user_no,
                uuid,
                title,
                is_private,
            };
    
            const user = User.of(user_no, 'User', LoginType.JWT);
    
            mockRepository.findByID.mockResolvedValue(bundle);
    
            const method = async () => await service.checkOwner(uuid, user);
    
            await expect(method()).resolves.not.toThrow();
        });

        it('소유자가 다를 경우 BundleForbiddenException을 발생시킨다.', async () => {
            const user_no = 1;
            const uuid = 'uuid' as UUID;
            const title = '번들이름';
            const is_private = true;
    
            const bundle: Bundle = {
                user_no: 2,
                uuid,
                title,
                is_private,
            };

            const user = User.of(user_no, 'User', LoginType.JWT);
    
            const expected = BundleForbiddenException;
    
            mockRepository.findByID.mockResolvedValue(bundle);
    
            const method = async () => await service.checkOwner(uuid, user);
    
            await expect(method()).rejects.toThrow(expected);
        });
    });

    describe('create', () => {
        it('새로운 꾸러미를 생성한다.', async () => {
            const user_no = 1;
            const uuid = 'uuid' as UUID;
            const title = '번들이름';
            const is_private = true;

            const createBundleDto: CreateBundleDto = {
                title,
                is_private,
            };
    
            const bundle: Bundle = {
                user_no,
                uuid,
                title,
                is_private,
            };

            const expected = bundle;
    
            const user = User.of(user_no, 'User', LoginType.JWT);
    
            mockRepository.create.mockResolvedValue(bundle);
    
            const actual = await service.create(createBundleDto, user);
    
            expect(actual).toEqual(expected);
        });
    });

    describe('addMusicToBundle', () => {
        it('꾸러미 소유자일 경우 꾸러미에 음악을 추가한다.', async () => {
            const user_no = 1;
            const uuid = 'uuid' as UUID;
            const title = '번들이름';
            const is_private = true;
            
            const addMusicToBundleDto: AddTrackDto = {
                external_url: 'externalUrl',
                title: '노래제목',
                artist: '아티스트',
                thumbnail: '썸네일',
            };

            const bundle: Bundle = {
                user_no,
                uuid,
                title,
                is_private,
            };

            const expected: BundleMusic = {
                bundle_music_pk: 1,
                bundle_id: 'uuid' as UUID,
                music_id: 1,
                create_at: new Date(),
            };
    
            const user = User.of(user_no, 'User', LoginType.JWT);
    
            mockRepository.findByID.mockResolvedValue(bundle);
            mockMusicService.createBundleMusic.mockResolvedValue(expected);
    
            const actual = await service.addTrackToBundle(uuid, addMusicToBundleDto, user);
    
            expect(actual).toEqual(expected);
            expect(mockMusicService.createBundleMusic).toHaveBeenCalledWith(addMusicToBundleDto, uuid);
        });

        it('꾸러미 소유자가 아닐 경우 BundleForbiddenException을 발생시킨다.', async () => {
            const user_no = 1;
            const uuid = 'uuid' as UUID;
            const title = '번들이름';
            const is_private = true;
            
            const addMusicToBundleDto: AddTrackDto = {
                external_url: 'externalUrl',
                title: '노래제목',
                artist: '아티스트',
                thumbnail: '썸네일',
            };
    
            const bundle: Bundle = {
                user_no: 2,
                uuid,
                title,
                is_private,
            };

            const expected = BundleForbiddenException;
    
            const user = User.of(user_no, 'User', LoginType.JWT);
    
            mockRepository.findByID.mockResolvedValue(bundle);
    
            const method = async () => await service.addTrackToBundle(uuid, addMusicToBundleDto, user);
    
            await expect(method()).rejects.toThrow(expected);
        });
    });

    describe('findManyBundleMusicByBundle', () => {
        it('꾸러미 소유자일 경우 꾸러미 노래 목록을 반환한다.', async () => {
            const user_no = 1;
            const uuid = 'uuid' as UUID;
            const title = '번들이름';
            const is_private = true;

            const bundle: Bundle = {
                user_no,
                uuid,
                title,
                is_private,
            };

            const expected: BundleMusicItem[] = [
                {
                    bundle_music_pk: 1,
                    external_url: '외부 링크',
                    title: '노래제목',
                    artist: '아티스트',
                    thumbnail: '썸네일',
                },
            ];
    
            const user = User.of(user_no, 'User', LoginType.JWT);
    
            mockRepository.findByID.mockResolvedValue(bundle);
            mockRepository.findManyBundleTrackByBundleId.mockResolvedValue(expected);
    
            const actual = await service.findManyBundleMusicByBundle(uuid, user);
    
            expect(actual).toEqual(expected);
        });

        it('꾸러미 소유자가 아닐 경우 BundleForbiddenException을 발생시킨다.', async () => {
            const user_no = 1;
            const uuid = 'uuid' as UUID;
            const title = '번들이름';
            const is_private = true;

            const bundle: Bundle = {
                user_no: 2,
                uuid,
                title,
                is_private,
            };

            const expected = BundleForbiddenException;
    
            const user = User.of(user_no, 'User', LoginType.JWT);
    
            mockRepository.findByID.mockResolvedValue(bundle);
    
            const method = async () => await service.findManyBundleMusicByBundle(uuid, user);
    
            await expect(method()).rejects.toThrow(expected);
        });
    });

    describe('findMany', () => {
        it('사용자가 자신의 꾸러미를 조회할 경우 전부 반환한다.', async () => {
            const user_no = 1;
            const username = 'User';
            const user = User.of(user_no, 'User', LoginType.JWT);

            const bundles: Omit<Bundle, 'user_no'>[] = [
                {
                    uuid: 'uuid' as UUID,
                    title: '노래제목',
                    is_private: true,
                },
                {
                    uuid: 'uuid2' as UUID,
                    title: '노래제목2',
                    is_private: false,
                },
            ];

            const expected: Omit<Bundle, 'user_no'>[] = bundles;

            mockRepository.findManyByUsername.mockResolvedValue(bundles);

            const actual = await service.findMany(username, user);

            expect(actual).toEqual(expected);
        });

        it('사용자와 꾸러미미의 소유자가 다를 경우 is_private가 false인 꾸러미만 반환한다.', async () => {
            const username = 'User';
            const user = User.of(1, 'UserA', LoginType.JWT);

            const bundles: Omit<Bundle, 'user_no'>[] = [
                {
                    uuid: 'uuid' as UUID,
                    title: '노래제목',
                    is_private: true,
                },
                {
                    uuid: 'uuid2' as UUID,
                    title: '노래제목2',
                    is_private: false,
                },
            ];

            const expected: Omit<Bundle, 'user_no'>[] = [bundles[1]];

            mockRepository.findManyByUsername.mockResolvedValue(bundles);

            const actual = await service.findMany(username, user);

            expect(actual).toEqual(expected);
        });
    });

    describe('update', () => {
        it('사용자와 꾸러미 소유자가 동일할 경우 업데이트 한다.', async () => {
            const user_no = 1;
            const uuid = 'uuid' as UUID;
            const title = '번들이름';
            const is_private = true;
            const bundle: Bundle = {
                user_no,
                uuid,
                title,
                is_private,
            };

            const updateBundleDto: UpdateBundleDto = {
                title: '꾸러미 이름',
                is_private: false,
            };

            const user = User.of(user_no, 'User', LoginType.JWT);
            
            const expected = bundle;

            mockRepository.findByID.mockResolvedValue(bundle);
            mockRepository.update.mockResolvedValue(bundle);

            const actual = await service.update(uuid, updateBundleDto, user);

            expect(actual).toEqual(expected);
            expect(mockRepository.update).toHaveBeenCalledWith(uuid, updateBundleDto);
        });

        it('꾸러미 소유자가 아닐 경우 BundleForbiddenException을 발생시킨다.', async () => {
            const user_no = 1;
            const uuid = 'uuid' as UUID;
            const title = '번들이름';
            const is_private = true;
            const bundle: Bundle = {
                user_no: 2,
                uuid,
                title,
                is_private,
            };

            const user = User.of(user_no, 'User', LoginType.JWT);
            
            const expected = BundleForbiddenException;

            mockRepository.findByID.mockResolvedValue(bundle);
            const method = async () => await service.remove(uuid, user);

            await expect(method()).rejects.toThrow(expected);
        });
    });

    describe('remove', () => {
        it('사용자와 꾸러미 소유자가 동일할 경우 삭제제 한다.', async () => {
            const user_no = 1;
            const uuid = 'uuid' as UUID;
            const title = '번들이름';
            const is_private = true;
            const bundle: Bundle = {
                user_no,
                uuid,
                title,
                is_private,
            };

            const user = User.of(user_no, 'User', LoginType.JWT);
            
            const expected = bundle;

            mockRepository.findByID.mockResolvedValue(bundle);
            mockRepository.remove.mockResolvedValue(bundle);

            const actual = await service.remove(uuid, user);

            expect(actual).toEqual(expected);
            expect(mockRepository.remove).toHaveBeenCalledWith(uuid);
        });

        it('꾸러미 소유자가 아닐 경우 BundleForbiddenException을 발생시킨다.', async () => {
            const user_no = 1;
            const uuid = 'uuid' as UUID;
            const title = '번들이름';
            const is_private = true;
            const bundle: Bundle = {
                user_no: 2,
                uuid,
                title,
                is_private,
            };

            const user = User.of(user_no, 'User', LoginType.JWT);
            
            const expected = BundleForbiddenException;

            mockRepository.findByID.mockResolvedValue(bundle);

            const method = async () => await service.remove(uuid, user);

            await expect(method()).rejects.toThrow(expected);
        });
    });
});
