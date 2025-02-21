import { RequestUser } from '@common/request-user';

export class RemoveCommentDto {
  constructor(
    public readonly id: number,
    public readonly reqUser: RequestUser
  ) {}
}