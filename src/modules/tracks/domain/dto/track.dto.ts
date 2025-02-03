import { CommentDto } from '@comments/domain/dto/comment.dto';

export class TrackDto {
    constructor(
        public readonly id: number,
        public readonly title: string,
        public readonly artist: string,
        public readonly thumbnail: string,
        public readonly comment_count: number,
        public readonly recent_comment?: CommentDto,
    ) {}
}