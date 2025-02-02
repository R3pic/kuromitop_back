import { BaseEntity, EntityIdType } from './entity.base';
import { BaseModel, ModelIdType } from './model.base';

export interface Mapper<
    Domain, 
    T extends BaseModel<ModelIdType<T>>, 
    K extends BaseEntity<EntityIdType<K>>, 
    CreateDto, 
    UpdateDto,
    RemoveDto,
> {
    toDomain(model: T): Domain;
    
    createDtoToEntity(dto: CreateDto): CreateDto extends never ? never : K;
    updateDtoToEntity(dto: UpdateDto): UpdateDto extends never ? never : K;
    removeDtoToEntity(dto: RemoveDto): RemoveDto extends never ? never : K;
}