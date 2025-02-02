import { CreateCommentBody } from './create-comment.body';
    
export class CreateCommentDto {
    trackId: number;
    content: string;
    
    constructor(track_id: number, createCommentBody: CreateCommentBody) {
        this.trackId = track_id;
        this.content = createCommentBody.content;
    }
}