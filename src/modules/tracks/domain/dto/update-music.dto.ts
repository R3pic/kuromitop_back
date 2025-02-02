import { PartialType } from '@nestjs/swagger';
import { CreateTrackDto } from './create-music.dto';

export class UpdateMusicDto extends PartialType(CreateTrackDto) {}
