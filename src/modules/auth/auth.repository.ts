import { Injectable, Logger } from '@nestjs/common';
import { Password } from './entities/password.entity';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPgPromise } from '@nestjs-cls/transactional-adapter-pg-promise';

@Injectable()
export class AuthRepository {
    private readonly logger = new Logger(AuthRepository.name);

    constructor(
        private readonly txHost: TransactionHost<TransactionalAdapterPgPromise>) {
    }

    async createPassword(user_no: number, password: string) {
        const query = `
        INSERT INTO auth.password (user_no, password) 
        VALUES ($1, $2) 
        RETURNING user_no, password, update_at
        `;
        return await this.txHost.tx.one<Password>(query, [ user_no, password ]);
    }

    async findPasswordByUsername(username: string) {
        const query = `
            SELECT Password.user_no, Password.password, Password.update_at
            FROM auth.password Password, member.user Member
            WHERE PASSWORD.user_no = Member.user_no
            AND Member.username = $1`;
        const password = await this.txHost.tx.oneOrNone<Password>(query, [username]);
        return password;
    }
}