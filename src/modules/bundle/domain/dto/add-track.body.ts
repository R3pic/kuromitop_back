import { IsDefined, IsString } from 'class-validator';

export class AddTrackBody {
  @IsDefined()
  @IsString()
  id: string;

  @IsDefined()
  @IsString()
  title: string;
    
  @IsDefined()
  @IsString()
  artist: string;
    
  @IsDefined()
  @IsString()
  thumbnail: string;
}
