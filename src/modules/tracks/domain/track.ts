import { BundleID } from '@bundle/domain/model/bundle.model';

export class Track {
  constructor(
    public id: number,
    public bundle_id: BundleID,
    public music_id: number,
    public title: string,
    public artist: string,
    public thumbnail: string,
  ) {

  }
}