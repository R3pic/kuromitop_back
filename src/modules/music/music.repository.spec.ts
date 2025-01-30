import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { ClsModule } from 'nestjs-cls';
import { getTransactionHostToken, TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPgPromise } from '@nestjs-cls/transactional-adapter-pg-promise';
import { PostgresError } from 'pg-error-enum';

import { clsModuleOptions } from '@common/config/cls-module.config';
import { configModuleOptions } from '@common/env/env.config';
import { PostgresModule } from '@common/database/postgres.module';

import { MusicRepository } from './music.repository';
import { BundleMusic } from './entities/bundle-music.entity';
import { CreateMusicDto } from './dto/create-music.dto';

describe('MusicRepository', () => {
    let repository: MusicRepository;
    let txHost: TransactionHost<TransactionalAdapterPgPromise>;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot(configModuleOptions),
                PostgresModule,
                ClsModule.forRoot(clsModuleOptions),
            ],
            providers: [MusicRepository],
        }).compile();

        repository = module.get<MusicRepository>(MusicRepository);
        txHost = module.get<TransactionHost<TransactionalAdapterPgPromise>>(getTransactionHostToken());
    });

    beforeEach(async () => {
        await txHost.tx.query('BEGIN');
    });

    afterEach(async () => {
        await txHost.tx.query('ROLLBACK');
        await txHost.tx.query('ALTER SEQUENCE music.bundle_music_bundle_music_pk_seq RESTART WITH 4');
        await txHost.tx.query('ALTER SEQUENCE music.info_music_id_seq RESTART WITH 4');
    });

    afterAll(async () => {
        await txHost.tx.$pool.end();
    });

    describe('checkOwnerBybundleMusicId', () => {
        it('자신의 꾸러미일 경우 true를 반환한다.', async () => {
            const expected = true;
                
            const actual = await repository.checkOwnerBybundleMusicId(1, 1);

            expect(actual).toEqual(expected);
        });

        it('자신의 꾸러미가 아닐 경우 false를 반환한다.', async () => {
            const expected = true;
                
            const actual = await repository.checkOwnerBybundleMusicId(1, 1);

            expect(actual).toEqual(expected);
        });
    });

    describe('createBundleMusic', () => {
        it('꾸러미에 새로운 음악을 추가한다.', async () => {
            const uuid = '45c30b73-08c3-4458-82a0-8fa00f74dd18';
            const musicId = 3;

            const expected: BundleMusic = {
                bundle_music_pk: 4,
                music_id: musicId,
                bundle_id: uuid,
                create_at: new Date(),
            };

            const actual = await repository.createBundleMusic(musicId, uuid);

            expect(actual.bundle_music_pk).toBe(expected.bundle_music_pk);
        });

        it('노래 정보가 존재하지 않는다면 FOREIGN_KEY_VIOLATION 에러를 발생시킨다.', async () => {
            const uuid = '45c30b73-08c3-4458-82a0-8fa00f74dd18';

            const method = async () => await repository.createBundleMusic(4, uuid);

            await expect(method()).rejects.toMatchObject({
                code: PostgresError.FOREIGN_KEY_VIOLATION,
            });
        });

        it('꾸러미가 존재하지 않는다면 FOREIGN_KEY_VIOLATION을을 발생시킨다.', async () => {
            const invalid_uuid = 'fdc04568-b16a-4531-a935-6610ca7b0b9a';
            const method = async () => await repository.createBundleMusic(4, invalid_uuid);

            await expect(method()).rejects.toMatchObject({
                code: PostgresError.FOREIGN_KEY_VIOLATION,
            });
        });

        it('한 꾸러미에 동일한 음악을 추가하면 에러를 발생시킨다.', async () => {
            const uuid = '45c30b73-08c3-4458-82a0-8fa00f74dd18';

            const method = async () => await repository.createBundleMusic(1, uuid);

            await expect(method()).rejects.toMatchObject({
                code: PostgresError.UNIQUE_VIOLATION,
            });
        });
    });

    describe('createMusicInfo', () => {
        it('새로운 음악 정보를 추가한다.', async () => {
            const createMusicDto: CreateMusicDto = {
                external_url: 'https://example4.com',
                title: '노래 제목 4',
                artist: '아티스트 4',
                thumbnail: 'https://thumbnail4.com',
            };

            const expected = 4;

            const actual = await repository.createMusicInfo(createMusicDto);

            expect(actual).toBe(expected);
        });

        it('중복된 external_url일 경우 UNIQUE VIOLATION을을 발생시킨다.', async () => {
            const createMusicDto: CreateMusicDto = {
                external_url: 'https://example1.com',
                title: '노래 제목 4',
                artist: '아티스트 4',
                thumbnail: 'https://thumbnail4.com',
            };

            const method = async () => await repository.createMusicInfo(createMusicDto);

            await expect(method()).rejects.toMatchObject({
                code: PostgresError.UNIQUE_VIOLATION,
            });
        });
    });

    // describe('isExistByExternalId', () => {
    //     it('존재할경우 true를 반환한다.', async () => {
    //         const externalUrl = 'https://example1.com';

    //         const expected = true;

    //         const actual = await repository.isExistByExternalId(externalUrl);
    
    //         expect(actual).toBe(expected);
    //     });

    //     it('존재하지 않을 경우 true를 반환한다.', async () => {
    //         const externalUrl = 'https://example4.com';

    //         const expected = false;

    //         const actual = await repository.isExistByExternalId(externalUrl);
    
    //         expect(actual).toBe(expected);
    //     });
    // });

    describe('findMusicIdByExternalUrl', () => {
        it('존재한다면 MusicId를 반환한다.', async () => {
            const externalUrl = 'https://example1.com';

            const expected = 1;

            const actual = await repository.findMusicIdByExternalUrl(externalUrl);
    
            expect(actual).toBe(expected);
        });

        it('존재하지 않을 경우 null을 반환한다.', async () => {
            const externalUrl = 'https://example4.com';

            const actual = await repository.findMusicIdByExternalUrl(externalUrl);
    
            expect(actual).toBeNull();
        });
    });

    describe('remove', () => {
        it('데이터가 존재할 경우 삭제한다.', async () => {
            const bundleMusicId = 1;

            const expected = bundleMusicId;

            const actual = await repository.remove(bundleMusicId);

            expect(actual?.bundle_music_pk).toBe(expected);
        });
    });
});
