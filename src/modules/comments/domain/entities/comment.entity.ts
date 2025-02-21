import { EntityBuilder } from '@common/base/entity-builder.base';
import { BaseEntity } from '@common/base/entity.base';

class CommentEntityBuilder extends EntityBuilder<CommentEntity> {
  constructor() {
    super(CommentEntity);
  }

  setTrackId(trackId: number) {
    this._entity.trackId = trackId;
    return this;
  }

  setContent(content: string) {
    this._entity.content = content;
    return this;
  }
}

export class CommentEntity extends BaseEntity {
  trackId: number;
  content: string;

  public static Builder = CommentEntityBuilder;
}
