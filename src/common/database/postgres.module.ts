import {
  Logger, Module, OnApplicationShutdown,
  OnModuleDestroy, 
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as pgPromise from 'pg-promise';
import { types } from 'pg';

export const DB = 'PG_CONNECTION';

const pgp = pgPromise({});
/* 
pg 라이브러리는 기본적으로 BigInt 반환시 String으로 변환함. 
BigInt인 경우에도 Int(32)로 변환하여 간편하게 동작하게 변경함.
만약 데이터베이스 내부에 BigInt가 사용된다면 값을 잃어버릴 수도 있으므로 주의해야함.
관련 내용: https://stackoverflow.com/questions/39168501/pg-promise-returns-integers-as-strings
*/ 
types.setTypeParser(20, (v) => parseInt(v, 10));

@Module({
  providers: [
    {
      provide: DB,
      useFactory: (configService: ConfigService) => {
        const dbConfig = {
          host: configService.get<string>('DB_HOST'),
          user: configService.get<string>('DB_USER'),
          password: configService.get<string>('DB_PASSWORD'),
          port: configService.get<number>('DB_PORT'),
          database: configService.get<string>('DB_DATABASE'),
        };

        return pgp(dbConfig);
      },
      inject: [ConfigService],
    },
  ],
  exports: [DB],
})
export class PostgresModule implements OnApplicationShutdown, OnModuleDestroy {
  private readonly logger = new Logger(PostgresModule.name);

  onModuleDestroy() {
    this.logger.log('try to close Database Connection...');
    pgp.end();
    this.logger.log('Successfully Closed Database Connection.');
  }

  onApplicationShutdown(signal?: string) {
    this.logger.log(`${signal} Received. try to close Database Connection...`);
    pgp.end();
    this.logger.log('Successfully Closed Database Connection.');
  }
}