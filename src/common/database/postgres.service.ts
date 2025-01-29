import {
    Injectable, Logger, OnModuleDestroy, 
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool, PoolClient } from 'pg';

@Injectable()
export class PostgresService implements OnModuleDestroy {
    private readonly logger = new Logger(PostgresService.name);
    private readonly pool: Pool;

    constructor(private readonly config: ConfigService) {
        const poolConfig = {
            host: config.get<string>('DB_HOST'),
            user: config.get<string>('DB_USER'),
            password: config.get<string>('DB_PASSWORD'),
            port: config.get<number>('DB_PORT'),
            database: config.get<string>('DB_DATABASE'),
        };
        this.logger.log(`📌 DB Config: ${JSON.stringify(poolConfig, null, 2)}`);

        this.pool = new Pool(poolConfig);
    }
    
    async getClient(): Promise<PoolClient> {
        return await this.pool.connect();
    }

    async onModuleDestroy() {
        await this.pool.end();
    }
}