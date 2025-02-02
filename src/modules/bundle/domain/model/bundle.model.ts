import { UUID } from 'crypto';
import { BaseModel } from '@common/base/model.base';

export class BundleModel extends BaseModel<UUID> {
    user_id: number;
    title: string;
    is_private: boolean;
    created_at: Date;
    updated_at: Date;
}

export type BundleID = BundleModel['id'];