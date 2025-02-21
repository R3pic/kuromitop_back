import { BundleID } from '@bundle/domain/model/bundle.model';


export class CreateTrackDto {
  id: BundleID;
  title: string;
  artist: string;
  thumbnail: string;
}
