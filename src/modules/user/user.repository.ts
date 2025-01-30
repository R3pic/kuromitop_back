import { Injectable } from '@nestjs/common';
import { Profile } from './entities/profile.entity';
import { User } from './entities/user.entity';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPgPromise } from '@nestjs-cls/transactional-adapter-pg-promise';
import { IsExists } from '@common/database/results';


@Injectable()
export class UserRepository {
    constructor(private readonly txHost: TransactionHost<TransactionalAdapterPgPromise>) {}

    async create(username: string) {
        const query = `
        INSERT INTO member.user (username, login_type) 
        VALUES ($1, 0)
        RETURNING user_no, username, login_type`;
        const user = await this.txHost.tx.one<User>(query, [username]);
        return user;
    }

    async findByNo(no: number) {
        const query = 'SELECT user_no, username, login_type FROM member.user WHERE user_no = $1';
        const result = await this.txHost.tx.oneOrNone<User>(query, [no]);
        return result;
    }

    async isExistByUsername(username: string) {
        const query = 'SELECT EXISTS(SELECT 1 FROM member.user WHERE username = $1)';
        const isExist = await this.txHost.tx.one<IsExists>(query, [username]);
        return isExist.exists;
    }

    async findUserByUsername(username: string): Promise<User | null> {
        const query = 'SELECT user_no, username, login_type FROM member.user WHERE username = $1';
        const user = await this.txHost.tx.oneOrNone<User>(query, [username]); 
        return user;
    }

    async findProfileByUsername(userName: string): Promise<Profile | null> {
        const query = `
            SELECT Profile.user_no, Profile.nickname, Profile.thumbnail_url, Profile.introduction, Profile.email, Profile.birthday, Profile.create_at
            FROM member.user Member, member.profile Profile
            WHERE Member.user_no = Profile.user_no
            AND Member.username = $1;
            `;
        const result = await this.txHost.tx.oneOrNone<Profile>(query, [userName]);
        return result;
    }
}