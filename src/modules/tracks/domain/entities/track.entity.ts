import { BundleID } from '@bundle/domain/model/bundle.model';
import { EntityBuilder } from '@common/base/entity-builder.base';
import { BaseEntity } from '@common/base/entity.base';

class TrackEntityBuilder extends EntityBuilder<TrackEntity> {
  constructor() {
    super(TrackEntity);
  }

  setMusicId(music_id: number) {
    this._entity.music_id = music_id;
    return this;
  }

  setBundleId(bundle_id: BundleID) {
    this._entity.bundle_id = bundle_id;
    return this;
  }
}

export class TrackEntity extends BaseEntity<number> {
  music_id: number;
  bundle_id: BundleID;

  public static Builder = TrackEntityBuilder;

  setMusicId(musicId: number) {
    this.music_id = musicId;
  }

  setBundleId(bundleId: BundleID) {
    this.bundle_id = bundleId;
  }
}