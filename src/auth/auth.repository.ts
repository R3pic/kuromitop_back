import { PostgresService } from '@common/database/postgres.service';
import { Injectable, Logger } from '@nestjs/common';
import { SignUpDto } from './dto/signup.dto';
import { DatabaseError } from 'pg';
import { User } from '@user/entities/user.entity';

@Injectable()
export class AuthRepository {
    private readonly logger = new Logger(AuthRepository.name);

    constructor(private readonly pool: PostgresService) {}

    async create({ username, email, password }: SignUpDto): Promise<number> {
        const client = await this.pool.getClient();
        try {
            await client.query('BEGIN');

            let query = 'INSERT INTO member.user (username, login_type) VALUES ($1, 0) RETURNING user_no';
            const userResult = await client.query<{ user_no: number }>(query, [username]);
            const { user_no } = userResult.rows[0];

            query = 'INSERT INTO member.profile (user_no, email) VALUES ($1, $2)';
            const profileResult = await client.query(query, [user_no, email]);

            query = 'INSERT INTO auth.password (user_no, password) VALUES ($1, $2)';
            const passwordResult = await client.query(query, [user_no, password]);

            await client.query('COMMIT');

            return (userResult.rowCount || 0) + (profileResult.rowCount || 0) + (passwordResult.rowCount || 0);
        } catch(e) {
            if (e instanceof DatabaseError) {
                await client.query('ROLLBACK');
                this.logger.error(e.message);
            }
            throw e;
        } 
        finally {
            client.release();
        }
    }

    async getPassword(username: string) {
        const client = await this.pool.getClient();

        try {
            const query = `SELECT Password.password
            FROM auth.password Password, member.user Member
            WHERE PASSWORD.user_no = Member.user_no
            AND Member.username = $1`;
            const result = await client.query<{ password: string}>(query, [username]);
            return result.rows[0]?.password || null;
        } finally {
            client.release();
        }
    }

    async getUserAuthByUsername(username: string): Promise<User | null> {
        const client = await this.pool.getClient();

        try {
            const query = `SELECT Member.user_no, Member.username, Member.login_type, Password.password
            FROM auth.password Password, member.user Member
            WHERE PASSWORD.user_no = Member.user_no
            AND Member.username = $1`;
            const result = await client.query<User>(query, [username]);
            return result.rows[0] || null;
        } finally {
            client.release();
        }
    }
}