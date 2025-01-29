import { PickType } from '@nestjs/swagger';
import { CreateMusicDto } from '@music/dto/create-music.dto';

export class AddMusicToBundleDto extends PickType(CreateMusicDto, [
    'external_url', 
    'title', 
    'artist', 
    'thumbnail',
] as const) {}
