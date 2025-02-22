import { forwardRef, Module } from '@nestjs/common';
import { SpotifyService } from '@spotify/spotify.service';
import { AuthModule } from '@auth/auth.module';

@Module({
  imports: [forwardRef(() => AuthModule)],
  exports: [SpotifyService],
  providers: [SpotifyService],
})
export class SpotifyModule {}
