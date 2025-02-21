import { Injectable } from '@nestjs/common';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPgPromise } from '@nestjs-cls/transactional-adapter-pg-promise';
import { Token } from '@auth/dto/token';
import { TokenModel } from '@auth/model/token.model';

@Injectable()
export class AuthRepository {
  constructor(
    private readonly txHost: TransactionHost<TransactionalAdapterPgPromise>,
  ) {}

  async findTokenByUserId(userId: string) {
    const query = `
      SELECT *
      FROM auth.token
      WHERE user_id = $1
    `;

    const model = await this.txHost.tx.one<TokenModel>(query, [userId]);

    return model;
  }

  async save(userId: string, token: Token) {
    const query = `
        INSERT INTO auth.token (user_id, access_token, refresh_token)
        VALUES ($1, $2, $3)
        RETURNING *`;
    const model = await this.txHost.tx.one<TokenModel>(query, [
      userId,
      token.accessToken,
      token.refreshToken,
    ]);

    return model;
  }

  async updateSpotifyToken(userId: string, tokens: Token) {
    const query = `
        UPDATE auth.token
        SET access_token = $1, refresh_token = $2
        WHERE user_id = $3
        RETURNING *;
    `;

    const model = await this.txHost.tx.one<TokenModel>(query, [
      tokens.accessToken,
      tokens.refreshToken,
      userId,
    ]);

    return model;
  }
}