import { CommentForbiddenExeception } from './comment-forbidden.error';

export class CommentServiceException {
    static COMMENT_FORBIDDEN = new CommentForbiddenExeception();
}