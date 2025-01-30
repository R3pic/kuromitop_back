import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { UUID } from 'crypto';
import { ClsModule } from 'nestjs-cls';
import { getTransactionHostToken, TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPgPromise } from '@nestjs-cls/transactional-adapter-pg-promise';

import { clsModuleOptions } from '@common/config/cls-module.config';
import { configModuleOptions } from '@common/env/env.config';
import { PostgresModule } from '@common/database/postgres.module';

import { BundleRepository } from './bundle.repository';
import { Bundle } from './entities/bundle.entity';
import { CreateBundleDto } from './dto/create-bundle.dto';
import { UpdateBundleDto } from './dto/update-bundle.dto';
import { BundleMusicItem } from './entities/bundle-music-item.entity';

describe('BundleRepository', () => {
    let repository: BundleRepository;
    let txHost: TransactionHost<TransactionalAdapterPgPromise>;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot(configModuleOptions),
                PostgresModule,
                ClsModule.forRoot(clsModuleOptions),
            ],
            providers: [BundleRepository],
        }).compile();

        repository = module.get<BundleRepository>(BundleRepository);
        txHost = module.get<TransactionHost<TransactionalAdapterPgPromise>>(getTransactionHostToken());
    });

    beforeEach(async () => {
        await txHost.tx.query('BEGIN');
    });

    afterEach(async () => {
        await txHost.tx.query('ROLLBACK');
        await txHost.tx.query('ALTER SEQUENCE music.bundle_music_bundle_music_pk_seq RESTART WITH 4');
    });

    afterAll(async () => {
        await txHost.tx.$pool.end();
    });

    describe('isExist', () => {
        it('꾸러미가 존재할 경우 true를 반환한다.', async () => {
            const result = await txHost.tx.one<{ uuid: UUID }>(
                'SELECT uuid FROM member.bundle WHERE user_no = 1 LIMIT 1'
            );

            const uuid = result.uuid;

            const expected = true;

            const actual = await repository.isExist(uuid);

            expect(actual).toEqual(expected);
        });

        it('꾸러미가 존재하지 않을 경우 false를 반환한다.', async () => {
            const invalid_uuid = 'fdc04568-b16a-4531-a935-6610ca7b0b9a';

            const expected = false;
                
            const actual = await repository.isExist(invalid_uuid);

            expect(actual).toEqual(expected);
        });
    });

    describe('create', () => {
        it('꾸러미를 생성한다.', async () => {
            const createBundleDto: CreateBundleDto = {
                title: '새로운 꾸러미',
                is_private: false,
            };

            const user_no = 1;

            const expected = {
                title: '새로운 꾸러미',
                is_private: false,
            };

            const actual = await repository.create(createBundleDto, user_no);
            
            expect(actual.title).toBe(expected.title);
            expect(actual.is_private).toBe(expected.is_private);
        });
    });

    describe('findManyByUsername', () => {
        it('꾸러미 목록을 반환한다.', async () => {
            const username = 'UserA';

            const expected: Omit<Bundle, 'user_no'>[] = [
                {
                    'is_private': false,
                    'title': 'A 테스트 꾸러미1',
                    'uuid': '45c30b73-08c3-4458-82a0-8fa00f74dd18',
                },
                {
                    'is_private': true,
                    'title': 'A 테스트 비밀 꾸러미1',
                    'uuid': '45c30b73-08c3-4458-82a0-8fa00f74dd19',
                },
            ];

            const actual = await repository.findManyByUsername(username);

            expect(actual).toEqual(expected);
        });

        it('꾸러미 목록이 없더라도 빈배열을 반환한다.', async () => {
            const username = 'UserD';

            const expected: Omit<Bundle, 'user_no'>[] = [];

            const actual = await repository.findManyByUsername(username);

            expect(actual).toEqual(expected);
        });
    });

    describe('findOneByUUID', () => {
        it('꾸러미를 반환한다.', async () => {
            const uuid = '45c30b73-08c3-4458-82a0-8fa00f74dd18';

            const expected: Bundle = {
                user_no: 1,
                uuid,
                title: 'A 테스트 꾸러미1',
                is_private: false,
            };

            const actual = await repository.findOneByUUID(uuid);

            expect(actual).toEqual(expected);
        });

        it('존재하지 않는다면 null을 반환한다.', async () => {
            const invalid_uuid = '45c30b73-08c3-4458-82a0-8fa00f74dd21';

            const actual = await repository.findOneByUUID(invalid_uuid);

            expect(actual).toBeNull();
        });
    });

    describe('findManyBundleMusicItemByBundleUUID', () => {
        it('꾸러미가 존재한다면 꾸러미 목록 내부 음악을 반환한다.', async () => {
            const uuid = '45c30b73-08c3-4458-82a0-8fa00f74dd18';

            const expected: BundleMusicItem[] = [
                {
                    bundle_music_pk: 1,
                    external_url: 'https://example1.com',
                    title: '노래제목1',
                    artist: '아티스트1',
                    thumbnail: 'https://thumbnail.com',
                },
                {
                    bundle_music_pk: 2,
                    external_url: 'https://example2.com',
                    title: '노래제목2',
                    artist: '아티스트2',
                    thumbnail: 'https://thumbnail.com',
                },
            ];

            const actual = await repository.findManyBundleMusicItemByBundleUUID(uuid);

            expect(actual).toEqual(expected);
        });

        it('관련된 내부 음악이 없다면 빈 배열을 반환한다.', async () => {
            const result = await txHost.tx.one<{ uuid: UUID }>(
                'SELECT uuid FROM member.bundle WHERE user_no = 2 LIMIT 1'
            );

            const expected: BundleMusicItem[] = [];

            const actual = await repository.findManyBundleMusicItemByBundleUUID(result.uuid);

            expect(actual).toEqual(expected);
        });
    });

    describe('update', () => {
        it('꾸러미의 이름을 변경시킨다.', async () => {
            const user_no = 1;
            const uuid = '45c30b73-08c3-4458-82a0-8fa00f74dd18';
            const title = '변경된 꾸러미';
            const is_private = true;

            const updateBundleDto: UpdateBundleDto = {
                title,
                is_private,
            };

            const expected: Bundle = {
                user_no,
                uuid,
                title,
                is_private,
            };

            const actual = await repository.update(uuid, updateBundleDto);

            expect(actual).toEqual(expected);
        });
    });

    describe('remove', () => {
        it('꾸러미를 삭제한다.', async () => {
            const user_no = 1;
            const uuid = '45c30b73-08c3-4458-82a0-8fa00f74dd18';
            const title = 'A 테스트 꾸러미1';
            const is_private = false;

            const expected: Bundle = {
                user_no,
                uuid,
                title,
                is_private,
            };

            const actual = await repository.remove(uuid);

            expect(actual).toEqual(expected);
        });
    });
});
