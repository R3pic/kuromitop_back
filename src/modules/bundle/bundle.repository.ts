import { Injectable, Logger } from '@nestjs/common';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPgPromise } from '@nestjs-cls/transactional-adapter-pg-promise';
import { UUID } from 'crypto';

import { IsExists } from '@common/database/results';

import { Bundle } from './entities/bundle.entity';
import { CreateBundleDto } from './dto/create-bundle.dto';
import { UpdateBundleDto } from './dto/update-bundle.dto';
import { BundleMusicItem } from './entities/bundle-music-item.entity';

@Injectable()
export class BundleRepository {
    private readonly logger = new Logger(BundleRepository.name);

    constructor(
        private readonly txHost: TransactionHost<TransactionalAdapterPgPromise>,
    ) {}

    async isExist(uuid: UUID) {
        const query = 'SELECT EXISTS(SELECT 1 FROM member.bundle WHERE uuid = $1)';;
        const result = await this.txHost.tx.one<IsExists>(query, [uuid]);
        return result.exists;
    }

    async create(createBundleDto: CreateBundleDto, user_no: number) {
        const query = `
            INSERT INTO member.bundle (user_no, title, is_private)
            VALUES ($1, $2, $3)
            RETURNING user_no, uuid, title, is_private
            `;

        const result = await this.txHost.tx.one<Bundle>(query, [
            user_no, 
            createBundleDto.title, 
            createBundleDto.is_private,
        ]);

        return result;
    }

    async findManyByUsername(username: string) {
        const query = `
            SELECT uuid, title, is_private
            FROM member.bundle Bundle, member.user Member
            WHERE Bundle.user_no = Member.user_no
            AND Member.username = $1
            `;
        const bundles = await this.txHost.tx.manyOrNone<Omit<Bundle, 'user_no'>>(query, [username]);
        return bundles;
    }

    async findManyBundleMusicItemByBundleUUID(uuid: UUID) {
        const query = `
            SELECT BundleMusic.bundle_music_pk, MusicInfo.external_url, MusicInfo.title, MusicInfo.artist, MusicInfo.thumbnail
            FROM music.info MusicInfo, music.bundle_music BundleMusic
            WHERE MusicInfo.music_id = BundleMusic.music_id
            AND BundleMusic.bundle_id = $1
            `;
        const bundleMusics = await this.txHost.tx.manyOrNone<BundleMusicItem>(query, [uuid]);
        return bundleMusics;
    }

    async findOneByUUID(uuid: UUID) {
        const query = `
            SELECT user_no, uuid, title, is_private
            FROM member.bundle
            WHERE uuid = $1
            `;
        const bundle = await this.txHost.tx.oneOrNone<Bundle>(query, [uuid]);
        return bundle;
    }

    async update(uuid: UUID, updateBundleDto: UpdateBundleDto) {
        const query = `
            UPDATE member.bundle
            SET title = $1, is_private = $2
            WHERE uuid = $3
            RETURNING user_no, uuid, title, is_private
            `;

        const bundle = await this.txHost.tx.one<Bundle>(query, [
            updateBundleDto.title,
            updateBundleDto.is_private,
            uuid,
        ]);
        return bundle;
    }

    async remove(uuid: UUID) {
        const query = `
            DELETE
            FROM member.bundle
            WHERE uuid = $1
            RETURNING user_no, uuid, title, is_private
            `;

        const deleted = await this.txHost.tx.oneOrNone<Bundle>(query, [uuid]);

        return deleted;
    }
}