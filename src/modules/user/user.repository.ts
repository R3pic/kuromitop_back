import { Injectable } from '@nestjs/common';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPgPromise } from '@nestjs-cls/transactional-adapter-pg-promise';

import { UserModel } from '@user/models/user.model';
import { CreateUserDto } from '@user/dto/create-user.dto';
import { UpdateUserDto } from '@user/dto/update-user.dto';

@Injectable()
export class UserRepository {
  constructor(
    private readonly txHost: TransactionHost<TransactionalAdapterPgPromise>,
  ) {}

  async create(user: CreateUserDto) {
    const query = `
        INSERT INTO member.user (id, display_name, thumbnail)
        VALUES ($1, $2, $3)
        RETURNING *`;
    const model = await this.txHost.tx.one<UserModel>(query, [
      user.id,
      user.displayName,
      user.thumbnail,
    ]);

    return model;
  }

  async update(user: UpdateUserDto) {
    const query = `
        UPDATE member.user
        SET introduction = $1
        WHERE id = $2
        RETURNING *;
    `;

    const model = await this.txHost.tx.one<UserModel>(query, [
      user.introduction,
      user.id,
    ]);

    return model;
  }

  async findById(id: string) {
    const query = `
        SELECT *
        FROM member.user 
        WHERE id = $1`;
    const model = await this.txHost.tx.oneOrNone<UserModel>(query, [id]);
    return model;
  }

  async findUserByUsername(username: string) {
    const query = `
        SELECT *
        FROM member.user 
        WHERE username = $1`;
    const user = await this.txHost.tx.oneOrNone<UserModel>(query, [username]); 
    return user;
  }
}