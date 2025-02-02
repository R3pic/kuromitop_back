import { RequestUser } from '@common/request-user';
import { BundleID } from '@bundle/domain/model/bundle.model';
import { UpdateBundleBody } from './update-bundle.body';

export class UpdateBundleDto {
    public readonly id: BundleID;
    public readonly title: string;
    public readonly is_private: boolean;
    public readonly reqUser: RequestUser;
    constructor(
        id: BundleID,
        updateBundleBody: UpdateBundleBody,
        reqUser: RequestUser,
    ) {
        this.id = id;
        this.title = updateBundleBody.title;
        this.is_private = updateBundleBody.is_private;
        this.reqUser = reqUser;
    }
}