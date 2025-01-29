import { Module } from '@nestjs/common';
import { MusicService } from './music.service';
import { MusicController } from './music.controller';
import { PostgresModule } from '@common/database/postgres.module';
import { MusicRepository } from './music.repository';

@Module({
    imports: [PostgresModule],
    exports: [MusicService],
    controllers: [MusicController],
    providers: [
        MusicService, 
        MusicRepository,
    ],
})
export class MusicModule {}
