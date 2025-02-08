import { BaseModel } from '@common/base/model.base';
import { BundleID } from '@bundle/domain/model/bundle.model';

export class TrackModel extends BaseModel {
    bundle_id: BundleID;
    music_id: number;
    title: string;
    artist: string;
    thumbnail: string;
} 