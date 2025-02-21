import { EntityBuilder } from '@common/base/entity-builder.base';
import { BaseEntity } from '@common/base/entity.base';
import { UUID } from 'crypto';

class BundleEntityBuilder extends EntityBuilder<BundleEntity, UUID> {
  constructor() {
    super(BundleEntity);
  }

  setUserId(user_id: string) {
    this._entity.user_id = user_id;
    return this;
  }

  setTitle(title: string) {
    this._entity.title = title;
    return this;
  }

  setIsPrivate(is_private: boolean) {
    this._entity.is_private = is_private;
    return this;
  }
}

export class BundleEntity extends BaseEntity<UUID> {
  user_id: string;
  title: string;
  is_private: boolean;

  public static Builder = BundleEntityBuilder;
}
