import { UUID } from 'crypto';
import { MusicInfo } from './music-info.entity';
import { OmitType } from '@nestjs/swagger';

export class Music extends OmitType(MusicInfo, ['music_id']) {
    bundle_id: UUID;
}
