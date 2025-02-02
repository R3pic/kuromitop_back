import {
    Logger, Module, OnApplicationShutdown,
    OnModuleDestroy, 
} from '@nestjs/common';
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