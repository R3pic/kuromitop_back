import { Injectable } from '@nestjs/common';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPgPromise } from '@nestjs-cls/transactional-adapter-pg-promise';

import { UserEntity } from './domain/entities/user.entity';
import { ProfileEntity } from './domain/entities/profile.entity';
import { UserModel } from './domain/models/user.model';
import { ProfileModel } from './domain/models/profile.model';

@Injectable()
export class UserRepository {
    constructor(
        private readonly txHost: TransactionHost<TransactionalAdapterPgPromise>,
    ) {}

    async create(user: UserEntity) {
        const query = `
        INSERT INTO member.user (username, password) 
        VALUES ($1, $2)
        RETURNING *`;
        const model = await this.txHost.tx.one<UserModel>(query, [
            user.username,
            user.password,
        ]);

        return model;
    }

    async findById(id: number) {
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

    async createProfile(profile: ProfileEntity) {
        const query = `
        INSERT INTO member.profile (user_id, nickname, thumbnail, introduction) 
        VALUES ($1, $2, $3, $4)
        RETURNING *`;
        const model = await this.txHost.tx.one<ProfileModel>(query, [
            profile.user_id,
            profile.nickname,
            profile.thumbnail,
            profile.introduction,
        ]);
        return model;
    }

    async updateProfile(profile: ProfileEntity) {
        const query = `
        UPDATE member.profile
        SET nickname = $1, thumbnail = $2, introduction = $3
        WHERE user_id = $4
        RETURNING *`;
        const model = await this.txHost.tx.one<ProfileModel>(query, [
            profile.nickname,
            profile.thumbnail,
            profile.introduction,
            profile.user_id,
        ]);
        return model;
    }

    async findProfileByUsername(userName: string) {
        const query = `
            SELECT Profile.*
            FROM member.user Member, member.profile Profile
            WHERE Member.id = Profile.user_id
            AND Member.username = $1;
            `;
        const result = await this.txHost.tx.oneOrNone<ProfileModel>(query, [userName]);
        return result;
    }
}