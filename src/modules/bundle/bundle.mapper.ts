import { Injectable } from '@nestjs/common';
import { Mapper } from '@common/base/mapper.base';
import { randomUUID } from 'crypto';

import { BundleEntity } from './domain/entities/bundle.entity';
import { BundleModel } from './domain/model/bundle.model';
import { CreateBundleDto } from './domain/dto/create-bundle.dto';
import { UpdateBundleDto } from './domain/dto/update-bundle.dto';
import { RemoveBundleDto } from './domain/dto/delete-bundle.dto';
import { BundleDto } from './domain/dto/bundle.dto';

@Injectable()
export class BundleMapper implements Mapper<
    never, BundleModel, BundleEntity, 
    CreateBundleDto, UpdateBundleDto, RemoveBundleDto
> {
    toDomain(): never {
        throw new Error('method not Implement');
    }

    toDto(model: BundleModel): BundleDto {
        return new BundleDto(
            model.id,
            model.title
        );
    }

    createDtoToEntity(dto: CreateBundleDto): BundleEntity {
        return new BundleEntity.Builder()
            .setId(randomUUID())
            .setUserId(dto.reqUser.id)
            .setTitle(dto.title)
            .setIsPrivate(dto.is_private)
            .build();
    }
    
    updateDtoToEntity(dto: UpdateBundleDto): BundleEntity {
        return new BundleEntity.Builder()
            .setId(dto.id)
            .setTitle(dto.title)
            .setIsPrivate(dto.is_private)
            .build();
    }

    removeDtoToEntity(dto: RemoveBundleDto): BundleEntity {
        return new BundleEntity.Builder()
            .setId(dto.id)
            .build();
    }
}