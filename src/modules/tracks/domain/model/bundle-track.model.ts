import { BundleID } from '@bundle/domain/model/bundle.model';
import { BaseModel } from '@common/base/model.base';

export class BundleTrackModel extends BaseModel { 
    music_id: number;
    bundle_id: BundleID;
}