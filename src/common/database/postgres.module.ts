import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as pgPromise from 'pg-promise';

export const DB = 'PG_CONNECTION';

const pgp = pgPromise({});

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

                return pgp<pgPromise.IDatabase<any>>(dbConfig);
            },
            inject: [ConfigService],
        },
    ],
    exports: [DB],
})
export class PostgresModule {}