import { Mapper } from '@common/base/mapper.base';
import { CommentModel } from './domain/model/comment.model';
import { CommentEntity } from './domain/entities/comment.entity';
import { CreateCommentDto } from './domain/dto/create-comment.dto';
import { RemoveCommentDto } from './domain/dto/remove-comment.dto';
import { CommentDto } from './domain/dto/comment.dto';

export class CommentMapper implements Mapper<
    never, CommentModel, CommentEntity,
    CreateCommentDto, never, RemoveCommentDto 
> {
    toDomain(): never {
        throw new Error('Method not implemented.');
    }

    toDto(model: CommentModel): CommentDto {
        return new CommentDto(
            model.id,
            model.content,
            model.created_at
        );
    }

    createDtoToEntity(dto: CreateCommentDto): CommentEntity {
        return new CommentEntity.Builder()
            .setTrackId(dto.trackId)
            .setContent(dto.content)
            .build();
    }

    updateDtoToEntity(): never {
        throw new Error('Method not implemented.');
    }

    removeDtoToEntity(dto: RemoveCommentDto): CommentEntity {
        return new CommentEntity.Builder()
            .setId(dto.id)
            .build();
    }

}