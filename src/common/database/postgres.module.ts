import { Module } from '@nestjs/common';
import { PostgresService } from './postgres.service';

@Module({
    imports: [],
    providers: [PostgresService],
    exports: [PostgresService]
})
export class PostgresModule {}