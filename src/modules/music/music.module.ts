import { Module } from '@nestjs/common';
import { MusicService } from './music.service';
import { MusicController } from './music.controller';
import { PostgresModule } from '@common/database/postgres.module';
import { BundleModule } from '@bundle/bundle.module';
import { MusicRepository } from './music.repository';

@Module({
    imports: [
        PostgresModule,
        BundleModule,
    ],
    controllers: [MusicController],
    providers: [
        MusicService, 
        MusicRepository,
    ],
})
export class MusicModule {}
