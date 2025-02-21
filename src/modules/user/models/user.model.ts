import { BaseModel } from '@common/base/model.base';

export class UserModel extends BaseModel<string> {
  display_name: string;
  thumbnail: string;
  introduction: string;
  created_at: Date;
  updated_at: Date;
}