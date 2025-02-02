import {
    IsDefined, IsString, IsUrl,
} from 'class-validator';

export class AddTrackBody {
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
