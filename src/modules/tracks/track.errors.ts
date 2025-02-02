import { ServiceException } from '@common/base/service-exception.base';
import { ConflictException, ForbiddenException } from '@nestjs/common';

export class TrackAlreadyInBundleException extends ServiceException {
    static readonly message = '한 꾸러미에 동일한 트랙을 중복 추가할 수 없습니다.';
    constructor() {
        super(new ConflictException(), TrackAlreadyInBundleException.message);
    }
}

export class TrackForbiddenException extends ServiceException{
    static readonly message = '해당 트랙에 대해 권한이 없습니다.';
    constructor() {
        super(new ForbiddenException(), TrackForbiddenException.message);
    }
}

export class TrackNotFoundException extends ServiceException{
    static readonly message = '존재하지 않는 트랙입니다.';
    constructor() {
        super(new ForbiddenException(), TrackNotFoundException.message);
    }
}