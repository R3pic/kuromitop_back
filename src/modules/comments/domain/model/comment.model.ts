import { BaseModel } from '@common/base/model.base';

export class CommentModel extends BaseModel {
  bundle_tracks_fk: number;
  content: string;
}