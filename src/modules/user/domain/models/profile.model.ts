import { BaseModel } from '@common/base/model.base';

export class ProfileModel extends BaseModel {
    user_id: number;
    nickname: string;
    thumbnail: string;
    introduction: string;
    created_at: Date;
    updated_at: Date;
}