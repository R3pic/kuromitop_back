import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { ConfigModule } from '@nestjs/config';
import { configModuleOptions } from '@common/env/env.config';
import { ClsModule } from 'nestjs-cls';
import { clsModuleOptions } from '@common/config/cls-module.config';
import { AuthModule } from '@auth/auth.module';
import { DB, PostgresModule } from '@common/database/postgres.module';
import { IClient } from 'pg-promise/typescript/pg-subset';

describe('AuthController (e2e)', () => {
  let app: INestApplication<App>;
  let moduleFixture: TestingModule;

  beforeAll(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [
        AuthModule,
        ConfigModule.forRoot(configModuleOptions), 
        ClsModule.forRoot(clsModuleOptions),
        PostgresModule,
      ],
    })
      .compile();

    const db = moduleFixture.get<IClient>(DB);

    await db.query('');
  });

  beforeEach(async () => {
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({
      transform: true,
      forbidNonWhitelisted: true,
      whitelist: true,
    }));
    await app.init();
  });

  describe('/auth/register (POST)', () => {
    it('요청의 Body가 올바르지 않을 경우 400 BadRequest를 반환한다.', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({})
        .expect(400);
    });
  });

    

  afterAll(async () => {
    await app.close();
  });
});
