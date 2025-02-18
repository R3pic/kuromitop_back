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

        if (bundle.user_id !== updateBundleDto.reqUser.id)
            throw new BundleForbiddenException();

        const entity = this.mapper.updateDtoToEntity(updateBundleDto);

        const model = await this.bundleRepository.update(entity);
        return this.mapper.toDto(model);
    }

    @Transactional()
    async remove(removeBundleDto: RemoveBundleDto) {
        const bundle = await this.findById(removeBundleDto.id);

        if (bundle.user_id !== removeBundleDto.reqUser.id)
            throw new BundleForbiddenException();

        const entity = this.mapper.removeDtoToEntity(removeBundleDto);

        return await this.bundleRepository.remove(entity);
    }

    @Transactional()
    async addTrackToBundle(addTrackDto: AddTrackDto) {
        this.logger.log(`AddTrackToBundle : ${JSON.stringify(addTrackDto)}`);
        const bundle = await this.findById(addTrackDto.id);

        if (bundle.user_id !== addTrackDto.reqUser.id ) {
            throw new BundleForbiddenException();
        }

        return await this.trackService.create(addTrackDto);
    }

    async findTracksByBundle(uuid: UUID, user: RequestUser) {
        this.logger.log(`FindTracksByBundle : ${uuid}`);
        const bundle = await this.findById(uuid);

        if (bundle.is_private && (user && user.id !== bundle.user_id)) {
            throw new BundleForbiddenException();
        }

        const tracks = await this.trackService.findManyByBundleId(bundle.id);

        return {
            title: bundle.title,
            tracks,
        };
    }
}
