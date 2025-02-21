import { Injectable, Logger } from '@nestjs/common';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPgPromise } from '@nestjs-cls/transactional-adapter-pg-promise';

import { BundleEntity } from './domain/entities/bundle.entity';
import { BundleID, BundleModel } from './domain/model/bundle.model';

@Injectable()
export class BundleRepository {
  private readonly logger = new Logger(BundleRepository.name);

  constructor(
    private readonly txHost: TransactionHost<TransactionalAdapterPgPromise>,
  ) {}

  async create(entity: BundleEntity) {
    const query = `
            INSERT INTO member.bundle (id, user_id, title, is_private)
            VALUES ($1, $2, $3, $4)
            RETURNING *
            `;

    const result = await this.txHost.tx.one<BundleModel>(query, [
      entity.id,
      entity.user_id, 
      entity.title, 
      entity.is_private,
    ]);

    return result;
  }

  async findByID(id: BundleID) {
    const query = `
            SELECT *
            FROM member.bundle
            WHERE id = $1
            `;

    const bundle = await this.txHost.tx.oneOrNone<BundleModel>(query, [id]);
    return bundle;
  }

  async update(entity: BundleEntity) {
    const query = `
            UPDATE member.bundle
            SET title = $1, is_private = $2, updated_at = $3
            WHERE id = $4
            RETURNING *
            `;

    const bundle = await this.txHost.tx.one<BundleModel>(query, [
      entity.title,
      entity.is_private,
      entity.updated_at,
      entity.id,
    ]);
    return bundle;
  }

  async remove(entity: BundleEntity) {
    const query = `
            DELETE
            FROM member.bundle
            WHERE id = $1
            RETURNING *
            `;

    const deleted = await this.txHost.tx.oneOrNone<BundleModel>(query, [entity.id]);

    return deleted;
  }

  async findManyByUserId(userId: string) {
    const query = `
            SELECT Bundle.*
            FROM member.bundle Bundle, member.user Member
            WHERE Bundle.user_id = Member.id
            AND Member.id = $1
            `;
    const bundles = await this.txHost.tx.manyOrNone<BundleModel>(query, [userId]);
    return bundles;
  }
}