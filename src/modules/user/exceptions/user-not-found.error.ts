import { ServiceException } from '@common/exception/service.error';
import { NotFoundException } from '@nestjs/common';

export class UserNotFoundException extends ServiceException {
    constructor() {
        super(
            new NotFoundException(),
            '존재하지 않는 유저입니다.',
        );
    }
}