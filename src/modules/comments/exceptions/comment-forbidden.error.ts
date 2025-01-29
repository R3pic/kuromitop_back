import { ServiceException } from '@common/exception/service.error';
import { ForbiddenException } from '@nestjs/common';

export class CommentForbiddenExeception extends ServiceException {
    constructor() {
        super(
            new ForbiddenException(),
            '해당 꾸러미 음악에 대한 권한이 없습니다.'
        );
    }
}