import { UUID } from 'crypto';
import { RequestUser } from '@common/request-user';

export class RemoveBundleDto {
    readonly id: UUID;
    readonly reqUser: RequestUser;

    constructor(id: UUID, reqUser: RequestUser) {
        this.id = id;
        this.reqUser = reqUser;
    }
}