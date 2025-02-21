import { ForbiddenException } from '@nestjs/common';
import { ServiceException } from '@common/base/service-exception.base';

export class CommentForbiddenExeception extends ServiceException {
  public static message = '해당 꾸러미 음악에 대한 권한이 없습니다.';
  constructor() {
    super(new ForbiddenException(), CommentForbiddenExeception.message);
  }
}

export class CommentNotFoundExeception extends ServiceException {
  public static message = '존재하지 않는 코멘트 아이디입니다.';
  constructor() {
    super(new ForbiddenException(), CommentForbiddenExeception.message);
  }
}