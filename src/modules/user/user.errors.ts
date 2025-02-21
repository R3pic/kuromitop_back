import {
  ConflictException, ForbiddenException, NotFoundException,
} from '@nestjs/common';
import { ServiceException } from '@common/base/service-exception.base';

export class UserNotFoundException extends ServiceException {
  static readonly message = '존재하지 않는 유저입니다.';
  constructor() {
    super(new NotFoundException(), UserNotFoundException.message);
  }
}

export class UserAlreadyExistsException extends ServiceException {
  static readonly message = '동일한 사용자가 이미 존재합니다.';
  constructor() {
    super(new ConflictException(), UserAlreadyExistsException.message);
  }
}

export class UserForbiddenException extends ServiceException {
  static readonly message = '권한이 없습니다.';
  constructor() {
    super(new ForbiddenException(), UserForbiddenException.message);
  }
}