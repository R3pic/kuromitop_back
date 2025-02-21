import { BundleID } from '@bundle/domain/model/bundle.model';
import { RequestUser } from '@common/request-user';
import { AddTrackBody } from './add-track.body';

export class AddTrackDto {
  public readonly id: BundleID;
  public readonly title: string;
  public readonly artist: string;
  public readonly thumbnail: string;
  public readonly reqUser: RequestUser;

  constructor(id: BundleID, addTrackBody: AddTrackBody, reqUser: RequestUser) {
    this.id = id;
    this.title = addTrackBody.title;
    this.artist = addTrackBody.artist;
    this.thumbnail = addTrackBody.thumbnail;
    this.reqUser = reqUser;
  }
}
