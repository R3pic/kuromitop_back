import { Module } from '@nestjs/common';
import { PostgresModule } from '@common/database/postgres.module';
import { TrackController } from './track.controller';
import { TrackService } from './track.service';
import { TrackRepository } from './track.repository';
import { TrackMapper } from './track.mapper';
import { CommentsModule } from '@comments/comments.module';
import { SpotifyModule } from '@spotify/spotify.module';

@Module({
  imports: [
    PostgresModule,
    CommentsModule,
    SpotifyModule,
  ],
  exports: [TrackService],
  controllers: [TrackController],
  providers: [
    TrackService, 
    TrackMapper,
    TrackRepository,
  ],
})
export class TrackModule {}
