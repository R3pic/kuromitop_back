import { ServiceException } from '@common/exception/service.error';
import { NotFoundException } from '@nestjs/common';

export class BundleNotFoundException extends ServiceException {
    constructor() {
        super(
            new NotFoundException(),
            '존재하지 않는 꾸러미입니다.',
        );
    }
}