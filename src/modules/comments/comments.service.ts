import { Injectable, Logger } from '@nestjs/common';
import { Transactional } from '@nestjs-cls/transactional';

import { CreateCommentDto } from './domain/dto/create-comment.dto'; 
import { CommentsRepository } from './comments.repository';
import { RemoveCommentDto } from './domain/dto/remove-comment.dto';
import { CommentForbiddenExeception, CommentNotFoundExeception } from './comments.errors';
import { CommentMapper } from './comment.mapper';
import { BundleID } from '@bundle/domain/model/bundle.model';

@Injectable()
export class CommentsService {
    private readonly logger = new Logger(CommentsService.name);
    constructor(
        private readonly commentRepository: CommentsRepository,
        private readonly mapper: CommentMapper,
    ) {}

    @Transactional()
    async create(createCommentDto: CreateCommentDto) {
        const entity = this.mapper.createDtoToEntity(createCommentDto);
        const comment = await this.commentRepository.create(entity);
        return comment;
    }

    async findPreviewCommentsByBundle(bundleId: BundleID) {
        const comments = await this.commentRepository.findPreviewCommensByBundle(bundleId);
        return comments.map((comment) => ({ ...this.mapper.toDto(comment), comment_count: comment.comment_count }));
    }

    async findManyByBundleMusicId(trackId: number) {
        const comments = await this.commentRepository.findManyByBundleMusicId(trackId);
        return comments.map(this.mapper.toDto);
    }

    @Transactional()
    async remove(removeCommentDto: RemoveCommentDto) {
        const comment = await this.commentRepository.findById(removeCommentDto.id);

        if (!comment) {
            throw new CommentNotFoundExeception();
        }

        if(comment.user_id !== removeCommentDto.reqUser.id)
            throw new CommentForbiddenExeception();

        const entity = this.mapper.removeDtoToEntity(removeCommentDto);

        return await this.commentRepository.remove(entity);
    }
}
