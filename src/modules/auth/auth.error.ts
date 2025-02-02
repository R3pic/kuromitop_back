import { UnauthorizedException } from '@nestjs/common';
import { ServiceException } from '@common/base/service-exception.base';

export class InvalidLocalCredentialException extends ServiceException {
    static readonly message = '아이디 혹은 비밀번호를 확인해주세요.';
    
    constructor() {
        super(new UnauthorizedException(), InvalidLocalCredentialException.message);
    }
}