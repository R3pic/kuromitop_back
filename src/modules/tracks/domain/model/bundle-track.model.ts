import { BundleID } from '@bundle/domain/model/bundle.model';
import { BaseModel } from '@common/base/model.base';

export class BundleTrackModel extends BaseModel {
    user_id: number;
    music_id: number;
    bundle_id: BundleID;
    is_private: boolean;
    title: string;
    artist: string;
    thumbnail: string;
}