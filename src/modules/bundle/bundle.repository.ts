import { Injectable, Logger } from '@nestjs/common';
import { DatabaseError } from 'pg';
import { UUID } from 'crypto';

import { PostgresService } from '@common/database/postgres.service';
import { User } from '@user/entities/user.entity';
import { Bundle } from './entities/bundle.entity';
import { CreateBundleDto } from './dto/create-bundle.dto';
import { UpdateBundleDto } from './dto/update-bundle.dto';
import { ExistsResult } from '@common/database/types';

@Injectable()
export class BundleRepository {
    private readonly logger = new Logger(BundleRepository.name);

    constructor(
        private readonly pool: PostgresService,
    ) {}

    async isExist(uuid: UUID): Promise<ExistsResult> {
        const client = await this.pool.getClient();
    
        try {
            const query = 'SELECT EXISTS(SELECT 1 FROM member.bundle WHERE uuid = $1)';;
            const result = await client.query<ExistsResult>(query, [uuid]);
            return result.rows[0];
        } finally {
            client.release();
        }
    }

    async create(createBundleDto: CreateBundleDto, user: User) {
        const client = await this.pool.getClient();

        try {
            const query = `
            INSERT INTO member.bundle (user_no, title, is_private)
            VALUES ($1, $2, $3)
            `;

            await client.query('BEGIN');
            const result = await client.query(query, [
                user.user_no, 
                createBundleDto.title, 
                createBundleDto.is_private,
            ]);
            await client.query('COMMIT');

            return result.rowCount || 0;
        } catch (e) {
            if (e instanceof DatabaseError) {
                await client.query('ROLLBACK');
                this.logger.error(e.message);
            }
            throw e;
        } finally {
            client.release();
        }
    }

    async findManyByUser(user: User) {
        const client = await this.pool.getClient();

        try {
            const query = `
            SELECT uuid, title, is_private
            FROM member.bundle
            WHERE user_no = $1
            `;
            const result = await client.query<Omit<Bundle, 'user_no'>>(query, [user.user_no]);
            return result.rows || null;
        } finally {
            client.release();
        }
    }

    async fineOneByUUID(uuid: UUID): Promise<Bundle | null> {
        const client = await this.pool.getClient();

        try {
            const query = `
            SELECT user_no, uuid, title, is_private
            FROM member.bundle
            WHERE uuid = $1
            `;
            const result = await client.query<Bundle>(query, [uuid]);
            return result.rows[0] || null;
        } finally {
            client.release();
        }
    }

    async update(uuid: UUID, updateBundleDto: UpdateBundleDto): Promise<number> {
        const client = await this.pool.getClient();

        try {
            const query = `
            UPDATE member.bundle
            SET title = $1, is_private = $2
            WHERE uuid = $3
            `;

            await client.query('BEGIN');
            const result = await client.query(query, [
                updateBundleDto.title,
                updateBundleDto.is_private,
                uuid,
            ]);
            await client.query('COMMIT');

            return result.rowCount || 0;
        } catch (e) {
            if (e instanceof DatabaseError) {
                await client.query('ROLLBACK');
                this.logger.error(e.message);
            }
            throw e;
        } finally {
            client.release();
        }
    }

    async remove(uuid: UUID): Promise<number> {
        const client = await this.pool.getClient();

        try {
            const query = `
            DELETE
            FROM member.bundle
            WHERE uuid = $1
            `;

            await client.query('BEGIN');
            const result = await client.query(query, [uuid]);
            await client.query('COMMIT');

            return result.rowCount || 0;
        } catch (e) {
            if (e instanceof DatabaseError) {
                await client.query('ROLLBACK');
                this.logger.error(e.message);
            }
            throw e;
        } finally {
            client.release();
        }
    }
}