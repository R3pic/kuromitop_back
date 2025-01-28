import { ServiceException } from '@common/exception/service.error';
import { ForbiddenException } from '@nestjs/common';

export class BundleForbiddenException extends ServiceException {
    constructor() {
        super(
            new ForbiddenException(),
            '존재하지 않는 꾸러미입니다.'
        );
    }
}