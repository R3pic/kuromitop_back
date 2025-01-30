import { ServiceException } from '@common/exception/service.error';
import { ConflictException } from '@nestjs/common';

export class UsernameAlreadyExistsException extends ServiceException {
    constructor() {
        super(
            new ConflictException(),
            '동일한 아이디가 이미 존재합니다.'
        );
    }
}