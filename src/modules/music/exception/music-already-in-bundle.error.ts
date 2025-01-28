import { ServiceException } from '@common/exception/service.error';
import { ConflictException } from '@nestjs/common';

export class MusicAlreadyInBundleException extends ServiceException{
    constructor() {
        super(
            new ConflictException(),
            '한 꾸러미에 동일한 음악을 중복 추가할 수 없습니다.'
        );
    }
}