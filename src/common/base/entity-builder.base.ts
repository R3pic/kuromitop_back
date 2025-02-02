import { UUID } from 'crypto';
import { BaseEntity } from './entity.base';
import { Builder } from './builder.interface';

export abstract class EntityBuilder<T extends BaseEntity<any>, K extends number | UUID = number> implements Builder<T> {
    protected _entity: T;

    constructor(TConstructor: (new() => T)) {
        this._entity = new TConstructor();
    }

    setId(id: K) {
        this._entity.id = id;
        return this;
    }

    setUpdatedAt(updatedAt: Date) {
        this._entity.updated_at = updatedAt;
        return this;
    }

    build(): T {
        this.setUpdatedAt(new Date());
        return this._entity;
    }
}

