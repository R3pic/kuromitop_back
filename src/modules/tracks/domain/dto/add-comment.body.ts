import {
  IsDefined, IsString, Length, 
} from 'class-validator';

export class AddCommentBody {

  @IsDefined()
  @IsString()
  @Length(5, 250)
  content: string;
}