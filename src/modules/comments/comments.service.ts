import { Injectable, Logger } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment-dto'; 
import { User } from '@user/entities/user.entity';
import { CommentsRepository } from './comments.repository';
import { MusicService } from '@music/music.service';
import { CommentServiceException } from './exceptions';

@Injectable()
export class CommentsService {
    private readonly logger = new Logger(CommentsService.name);
    constructor(
        private readonly commentRepository: CommentsRepository,
        private readonly musicService: MusicService,
    ) {}

    async create(createCommentDto: CreateCommentDto, user: User) {
        const isOwner = await this.musicService.checkOwnerBybundleMusicId(createCommentDto.bundle_music_fk, user);

        if (!isOwner) {
            throw CommentServiceException.COMMENT_FORBIDDEN;
        }

        const comment = await this.commentRepository.create(createCommentDto); 

        this.logger.log(`새로운 코멘트 생성됨 : ${JSON.stringify(comment)}`);
        return comment;
    }

    async findManyByBundleMusicId(bundleMusicId: number, user: User) {
        const isOwner = await this.musicService.checkOwnerBybundleMusicId(bundleMusicId, user);
        
        if (!isOwner) {
            throw CommentServiceException.COMMENT_FORBIDDEN;
        }

        return await this.commentRepository.findManyByBundleMusicId(bundleMusicId);
    }

    async remove(commentId: number, user: User) {
        const isOwner = await this.checkOwner(commentId, user);

        if (!isOwner) {
            throw CommentServiceException.COMMENT_FORBIDDEN;
        }

        return await this.commentRepository.remove(commentId);
    }

    async checkOwner(commentId: number, user: User) {
        const { is_owner } = await this.commentRepository.checkOwnerByCommentId(commentId, user);
        return is_owner; 
    }
}
