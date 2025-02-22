import { BundleID } from '@bundle/domain/model/bundle.model';

export class CreateTrackDto {
  bundleId: BundleID;
  musicId: string;
  title: string;
  artist: string;
  thumbnail: string;
}
