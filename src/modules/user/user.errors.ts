import { ConflictException, NotFoundException } from '@nestjs/common';
import { ServiceException } from '@common/base/service-exception.base';

export class UserNotFoundException extends ServiceException {
    static readonly message = '존재하지 않는 유저입니다.';
    constructor() {
        super(new NotFoundException(), UserNotFoundException.message);
    }
}

export class UsernameAlreadyExistsException extends ServiceException {
    static readonly message = '동일한 아이디가 이미 존재합니다.';
    constructor() {
        super(new ConflictException(), UsernameAlreadyExistsException.message);
    }
}