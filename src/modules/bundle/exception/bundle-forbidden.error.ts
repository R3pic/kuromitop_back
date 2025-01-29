import { ServiceException } from '@common/exception/service.error';
import { ForbiddenException } from '@nestjs/common';

export class BundleForbiddenException extends ServiceException {
    constructor() {
        super(
            new ForbiddenException(),
            '해당 꾸러미에 대한 권한이 없습니다.'
        );
    }
}