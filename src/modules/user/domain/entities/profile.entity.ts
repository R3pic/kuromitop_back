import { EntityBuilder } from '@common/base/entity-builder.base';
import { BaseEntity } from '@common/base/entity.base';

class ProfileEntityBuilder extends EntityBuilder<ProfileEntity> {
    constructor() {
        super(ProfileEntity);
    }

    setUserId(user_id: number) {
        this._entity.user_id = user_id;
        return this;
    }

    setNickName(nickname: string) {
        this._entity.nickname = nickname;
        return this;
    }

    setThumbnail(thumbnail: string) {
        this._entity.thumbnail = thumbnail;
        return this;
    }

    setIntroduction(introduction: string) {
        this._entity.introduction = introduction;
        return this;
    }
}

export class ProfileEntity extends BaseEntity {
    user_id: number;
    nickname: string;
    thumbnail: string;
    introduction: string;

    public static Builder = ProfileEntityBuilder;

    setUserId(id: number) {
        this.user_id = id;
    }
}

