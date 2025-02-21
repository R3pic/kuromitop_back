import { RequestUser } from '@common/request-user';
import { AddCommentBody } from './add-comment.body';

export class AddCommentDto {
  readonly trackId: number;
  readonly content: string;
  readonly reqUser: RequestUser;
  constructor(
    trackId: number,
    addCommentBody: AddCommentBody,
    reqUser: RequestUser,
  ) {
    this.trackId = trackId;
    this.content = addCommentBody.content;
    this.reqUser = reqUser;
  }
}