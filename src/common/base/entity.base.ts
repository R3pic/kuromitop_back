import { UUID } from 'crypto';

export type EntityIdType<T> = T extends BaseEntity<infer ID> ? [ID] extends [number] ? number : UUID | string : never;

export abstract class BaseEntity<T extends number | UUID | string = number> {
  public id: T;
  public updated_at: Date;
}