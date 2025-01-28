import {
    IsDefined, IsString, IsUrl,
} from 'class-validator';

export class CreateMusicDto {

    @IsDefined()
    @IsUrl()
    external_url: string;

    @IsDefined()
    @IsString()
    title: string;

    @IsDefined()
    @IsString()
    artist: string;

    @IsDefined()
    @IsUrl()
    thumbnail: string;
}
