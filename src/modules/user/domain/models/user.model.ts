import { BaseModel } from '@common/base/model.base';

export class UserModel extends BaseModel {
    username: string;
    password: string;
    created_at: Date;
    updated_at: Date;
}