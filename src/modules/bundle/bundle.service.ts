import { Injectable, Logger } from '@nestjs/common';
import { Transactional } from '@nestjs-cls/transactional';
import { UUID } from 'crypto';

import { RequestUser } from '@common/request-user';
import { TrackService } from '@tracks/track.service';

import { BundleRepository } from './bundle.repository';
import { BundleMapper } from './bundle.mapper';

import { BundleID } from './domain/model/bundle.model';
import { CreateBundleDto } from './domain/dto/create-bundle.dto';
import { UpdateBundleDto } from './domain/dto/update-bundle.dto';
import { AddTrackDto } from './domain/dto/add-track.dto';
import { RemoveBundleDto } from './domain/dto/delete-bundle.dto';
import { BundleDto } from './domain/dto/bundle.dto';
import { BundleForbiddenException, BundleNotFoundException } from './bundle.errors';

@Injectable()
export class BundleService {
    private logger = new Logger(BundleService.name);
    constructor(
        private readonly bundleRepository: BundleRepository,
        private readonly mapper: BundleMapper,
        private readonly trackService: TrackService,
    ) {}

    @Transactional()
    async create(createBundleDto: CreateBundleDto) {
        const entity = this.mapper.createDtoToEntity(createBundleDto);
        const bundle = await this.bundleRepository.create(entity);
        return bundle.id;
    }

    async findById(id: BundleID) {
        const bundle = await this.bundleRepository.findByID(id);

        if (!bundle) {
            throw new BundleNotFoundException();
        }

        return bundle;
    }
    
    async findMany(username: string, user: RequestUser | null) {
        const bundles = await this.bundleRepository.findManyByUsername(username);

        return bundles.reduce<BundleDto[]>((list, bundle) => {
            const dto = this.mapper.toDto(bundle);

            if (bundle.is_private) {
                if (user && user.username === username)
                    list.push(dto);

                return list;
            }
        
            list.push(dto);

            return list;
        }, []);
    }

    @Transactional()
    async update(updateBundleDto: UpdateBundleDto) {
        const bundle = await this.findById(updateBundleDto.id);

        const domain = this.mapper.toDomain(bundle);

        if (!domain.isOwner(updateBundleDto.reqUser))
            throw new BundleForbiddenException();

        const entity = this.mapper.updateDtoToEntity(updateBundleDto);

        const model = await this.bundleRepository.update(entity);
        return this.mapper.toDto(model);
    }

    @Transactional()
    async remove(removeBundleDto: RemoveBundleDto) {
        const bundle = await this.findById(removeBundleDto.id);

        const domain = this.mapper.toDomain(bundle);

        if (!domain.isOwner(removeBundleDto.reqUser))
            throw new BundleForbiddenException();

        const entity = this.mapper.removeDtoToEntity(removeBundleDto);

        return await this.bundleRepository.remove(entity);
    }

    @Transactional()
    async addTrackToBundle(addTrackDto: AddTrackDto) {
        this.logger.log(`트랙 추가 요청 Dto : ${JSON.stringify(addTrackDto)}`);
        const bundle = await this.findById(addTrackDto.id);

        const domain = this.mapper.toDomain(bundle);

        const isOwner = domain.isOwner(addTrackDto.reqUser);

        if (!isOwner) {
            throw new BundleForbiddenException();
        }

        return await this.trackService.create(addTrackDto);
    }

    async findTracksByBundle(uuid: UUID, user: RequestUser) {
        const bundle = await this.findById(uuid);

        const domain = this.mapper.toDomain(bundle);

        if (!domain.isOwner(user)) {
            throw new BundleForbiddenException();
        }

        const tracks = await this.trackService.findManyByBundleId(bundle.id);

        return {
            title: bundle.title,
            tracks,
        };
    }
}
