import { ServiceException } from '@common/base/service-exception.base';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

export class BundleForbiddenException extends ServiceException {
  static readonly message = '해당 꾸러미에 대한 권한이 없습니다.';
  constructor() {
    super(new ForbiddenException(), BundleForbiddenException.message);
  }
}

export class BundleNotFoundException extends ServiceException {
  static readonly message = '존재하지 않는 꾸러미입니다.';
  constructor() {
    super(new NotFoundException(), BundleNotFoundException.message);
  }
}