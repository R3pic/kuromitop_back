import { EntityBuilder } from '@common/base/entity-builder.base';
import { BaseEntity } from '@common/base/entity.base';

class UserEntityBuilder extends EntityBuilder<UserEntity> {
    constructor() {
        super(UserEntity);
    }

    setUsername(username: string) {
        this._entity.username = username;
        return this;
    }

    setPassword(password: string) {
        this._entity.password = password;
        return this;
    }
}

export class UserEntity extends BaseEntity {
    public username: string;
    public password: string;

    public static Builder = UserEntityBuilder;
}

