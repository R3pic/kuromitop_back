import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { BundleModule } from '@bundle/bundle.module';
import { ConfigModule } from '@nestjs/config';
import { configModuleOptions } from '@common/env/env.config';
import { ClsModule } from 'nestjs-cls';
import { clsModuleOptions } from '@common/config/cls-module.config';
import { AuthModule } from '@auth/auth.module';
import { getTransactionHostToken, TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPgPromise } from '@nestjs-cls/transactional-adapter-pg-promise';

describe('BundleController (e2e)', () => {
  let app: INestApplication<App>;
  let txHost: TransactionHost<TransactionalAdapterPgPromise>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ 
        BundleModule, 
        ConfigModule.forRoot(configModuleOptions), 
        ClsModule.forRoot(clsModuleOptions),
        AuthModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    txHost = app.get<TransactionHost<TransactionalAdapterPgPromise>>(getTransactionHostToken());

    await txHost.tx.query('BEGIN');
    await txHost.tx.query('SAVEPOINT test_point');
  });

  afterEach(async () => {
    await txHost.tx.query('ROLLBACK TO test_point');
  });

  it('/bundles/:username (GET)', () => {
    return request(app.getHttpServer())
      .get('/bundles/UserA')
      .expect(200)
      .expect([{ 'uuid':'45c30b73-08c3-4458-82a0-8fa00f74dd18', 'title':'A 테스트 꾸러미1', 'is_private':false }]);
  });

  afterAll(async () => {
    await app.close();
  });
});
