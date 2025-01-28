import { UnauthorizedException } from '@nestjs/common';
import { ServiceException } from '@common/exception/service.error';

export class InvalidLocalCredentialException extends ServiceException {
    constructor() {
        super(
            new UnauthorizedException(),
            '아이디 혹은 비밀번호를 확인해주세요.'
        );
    }
}