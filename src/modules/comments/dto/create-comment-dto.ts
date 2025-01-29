import {
    IsDefined, 
    IsNumber, 
    IsString, 
    Length, 
} from 'class-validator';
import { COMMENT } from '../constants';
import { CreateCommentBody } from './create-comment.body';
    
export class CreateCommentDto {
    @IsDefined()
    @IsNumber()
    bundle_music_fk: number;

    @IsDefined()
    @IsString()
    @Length(COMMENT.MIN_LENGHT, COMMENT.MAX_LENGTH)
    comment: string;
    
    constructor(bundleMusicId: number, comment: string) {
        this.bundle_music_fk = bundleMusicId;
        this.comment = comment;
    }

    static of(bundleMusicId: number, createCommentBody: CreateCommentBody) {
        return new CreateCommentDto(bundleMusicId, createCommentBody.comment);
    }
}