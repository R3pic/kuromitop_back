import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { ClsModule } from 'nestjs-cls';
import { getTransactionHostToken, TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPgPromise } from '@nestjs-cls/transactional-adapter-pg-promise';

import { clsModuleOptions } from '@common/config/cls-module.config';
import { configModuleOptions } from '@common/env/env.config';
import { PostgresModule } from '@common/database/postgres.module';

import { AuthRepository } from './auth.repository';
import { Password } from './entities/password.entity';
import { PostgresError } from 'pg-error-enum';

describe('AuthRepository', () => {
    let repository: AuthRepository;
    let txHost: TransactionHost<TransactionalAdapterPgPromise>;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot(configModuleOptions),
                PostgresModule,
                ClsModule.forRoot(clsModuleOptions),
            ],
            providers: [AuthRepository],
        }).compile();

        repository = module.get<AuthRepository>(AuthRepository);
        txHost = module.get<TransactionHost<TransactionalAdapterPgPromise>>(getTransactionHostToken());
    });

    beforeEach(async () => {
        await txHost.tx.query('BEGIN');
    });

    afterEach(async () => {
        await txHost.tx.query('ROLLBACK');
        await txHost.tx.query('ALTER SEQUENCE auth.password_password_id_seq RESTART WITH 4');
    });

    afterAll(async () => {
        await txHost.tx.$pool.end();
    });

    describe('createPassword', () => {
        it('새로운 비밀번호를 데이터베이스에 생성한다.', async () => {
            const expected = 'TestPassword';
                
            const actual = await repository.createPassword(1, expected);

            expect(actual.password).toEqual(expected);
        });

        it('유저보다 먼저 생성할 경우 FOREIGN_KEY_VIOLATION이 발생한다다', async () => {
            const method = async () => await repository.createPassword(4, 'test');

            await expect(method()).rejects.toMatchObject({
                code: PostgresError.FOREIGN_KEY_VIOLATION,
            });
        });
    });

    describe('getPassword', () => {
        it('존재하는 유저일 경우', async () => {
            const expected = new Password(1, 'testPassword1', new Date());

            const actual = await repository.findPasswordByUsername('UserA');

            expect(actual).toBeDefined();
            expect(actual?.password).toBe(expected.password);
        });

        it('존재하지 않는 유저일 경우', async () => {
            const actual = await repository.findPasswordByUsername('TestUser');

            expect(actual).toBeNull();
        });
    });
});
