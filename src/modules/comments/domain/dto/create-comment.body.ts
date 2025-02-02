import {
    IsDefined, 
    IsString, 
    Length, 
} from 'class-validator';
import { COMMENT } from '@comments/constants';

export class CreateCommentBody {
    @IsDefined()
    @IsString()
    @Length(COMMENT.MIN_LENGHT, COMMENT.MAX_LENGTH)
    content: string;
}
