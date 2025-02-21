import { RequestUser } from '@common/request-user';
import { CreateBundleBody } from './create-bundle.body';

export class CreateBundleDto {
  title: string;
  is_private: boolean;
  reqUser: RequestUser;

  constructor(createBundleBody: CreateBundleBody, reqUser: RequestUser) {
    this.title = createBundleBody.title;
    this.is_private = createBundleBody.is_private;
    this.reqUser = reqUser;
  }
}
