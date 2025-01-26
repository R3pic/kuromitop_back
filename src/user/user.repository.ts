import { PostgresService } from '@common/database/postgres.service';
import { Injectable } from '@nestjs/common';
import { Profile } from './entities/profile.entity';
import { User } from './entities/user.entity';

@Injectable()
export class UserRepository {
    constructor(private readonly pool: PostgresService) {}

    async isExistByUsername(username: string) {
        const client = await this.pool.getClient();

        try {
            const query = 'SELECT EXISTS(SELECT 1 FROM member.user WHERE username = $1)';
            const result = await client.query<{ exists: boolean }>(query, [username]);
            return result.rows[0]?.exists || false;
        } finally {
            client.release();
        }
    }

    async getUserByUsername(username: string): Promise<User | null> {
        const client = await this.pool.getClient();

        try {
            const query = 'SELECT user_no, username, login_type FROM member.user WHERE username = $1';
            const result = await client.query<User>(query, [username]); 
            return result.rows[0] || null;
        } finally {
            client.release();
        }
    }

    async getProfileByUsername(userName: string): Promise<Profile | null> {
        const client = await this.pool.getClient();

        try {
            const query = `
            SELECT Member.username, Profile.nickname, Profile.thumbnail_url, Profile.introduction, Profile.email, Profile.birthday, Profile.auth_date
            FROM member.user Member, member.profile Profile
            WHERE Member.user_no = Profile.user_no
            AND Member.username = $1;
            `;
            const result = await client.query<Profile>(query, [userName]);
            return result.rows[0] || null;
        } finally {
            client.release();
        }
    }
}