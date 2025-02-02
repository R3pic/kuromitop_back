import { UUID } from 'crypto';

export type ModelIdType<T> = T extends BaseModel<infer ID> ? [ID] extends [number] ? number : UUID : never;

export abstract class BaseModel<T extends number | UUID = number> {
    public id: T;
    public created_at: Date;
}