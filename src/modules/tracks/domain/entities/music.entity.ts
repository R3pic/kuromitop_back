import { EntityBuilder } from '@common/base/entity-builder.base';
import { BaseEntity } from '@common/base/entity.base';

class MusicEntityBuilder extends EntityBuilder<MusicEntity, string> {
  constructor() {
    super(MusicEntity);
  }

  setTitle(title: string) {
    this._entity.title = title;
    return this;
  }

  setArtist(artist: string) {
    this._entity.artist = artist;
    return this;
  }

  setThumbnail(thumbnail: string) {
    this._entity.thumbnail = thumbnail;
    return this;
  }
}

export class MusicEntity extends BaseEntity<string> {
  title: string;
  artist: string;
  thumbnail: string;

  public static Builder = MusicEntityBuilder;
}