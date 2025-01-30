import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { ClsModule } from 'nestjs-cls';
import { getTransactionHostToken, TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPgPromise } from '@nestjs-cls/transactional-adapter-pg-promise';
import { PostgresError } from 'pg-error-enum';

import { clsModuleOptions } from '@common/config/cls-module.config';
import { configModuleOptions } from '@common/env/env.config';
import { PostgresModule } from '@common/database/postgres.module';

import { UserRepository } from './user.repository';
import { LoginType, User } from './entities/user.entity';
import { Profile } from './entities/profile.entity';

describe('UserRepository', () => {
    let repository: UserRepository;
    let txHost: TransactionHost<TransactionalAdapterPgPromise>;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot(configModuleOptions),
                PostgresModule,
                ClsModule.forRoot(clsModuleOptions),
            ],
            providers: [UserRepository],
        }).compile();

        repository = module.get<UserRepository>(UserRepository);
        txHost = module.get<TransactionHost<TransactionalAdapterPgPromise>>(getTransactionHostToken());
    });

    beforeEach(async () => {
        await txHost.tx.query('BEGIN');
    });

    afterEach(async () => {
        await txHost.tx.query('ROLLBACK');
    });

    afterAll(async () => {
        await txHost.tx.$pool.end();
    });

    describe('create', () => {
        it('중복이 없다면 새로운 유저를 생성한다.', async () => {
            const username = 'TestUser';

            const expected = username;

            const actual = await repository.create('TestUser');

            expect(actual.username).toEqual(expected);
        });

        it('중복된 아이디를 사용하면 UNIQUE VIOLATION을 발생시킨다.', async () => {
            const username = 'UserA';

            const method = async () => await repository.create(username);

            await expect(method()).rejects.toMatchObject({
                code: PostgresError.UNIQUE_VIOLATION,
            });
        });
    });

    describe('findByNo', () => {
        it('존재하는 유저일 경우', async () => {
            const expected = User.of(1, 'UserA', LoginType.JWT);

            const actual = await repository.findByNo(1);

            expect(actual).toEqual(expected);
        });

        it('존재하지 않는 유저일 경우', async () => {
            const actual = await repository.findByNo(4);

            expect(actual).toBeNull();
        });
    });

    describe('isExistByUsername', () => {
        it('존재하는 유저일 경우', async () => {
            const expected = true;

            const actual = await repository.isExistByUsername('UserA');

            expect(actual).toEqual(expected);
        });

        it('존재하지 않는 유저일 경우', async () => {
            const expected = false;

            const actual = await repository.isExistByUsername('UserD');

            expect(actual).toEqual(expected);
        });
    });

    describe('getUserByUsername', () => {
        it('존재하는 유저일 경우', async () => {
            const expected = User.of(1, 'UserA', LoginType.JWT);

            const actual = await repository.findUserByUsername('UserA');

            expect(actual).toEqual(expected);
        });

        it('존재하지 않는 유저일 경우', async () => {
            const actual = await repository.findUserByUsername('UserD');

            expect(actual).toBeNull();
        });
    });

    describe('getProfileByUsername', () => {
        it('존재하는 유저일 경우', async () => {
            const expected: Profile = {
                user_no: 1,
                nickname: 'ANickname',
                thumbnail_url: null,
                introduction: null,
                email: null,
                birthday: null,
                auth_date: new Date(),
            };

            const actual = await repository.findProfileByUsername('UserA');

            expect(actual?.user_no).toEqual(expected.user_no);
            expect(actual?.nickname).toEqual(expected.nickname);
            expect(actual?.thumbnail_url).toEqual(expected.thumbnail_url);
        });

        it('존재하지 않는 유저일 경우', async () => {
            const actual = await repository.findProfileByUsername('UserD');

            expect(actual).toBeNull();
        });
    });
});
