import { RequestUser } from '@common/request-user';
import { BundleID } from './model/bundle.model';

export class Bundle {
    constructor(
        public owner_id: number,
        public bundle_id: BundleID
    ) {}

    isOwner(reqUser: Pick<RequestUser, 'id'>) {
        return reqUser && this.owner_id === reqUser.id;
    }
}