import { Injectable, Logger } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment-dto'; 
import { User } from '@user/entities/user.entity';
import { CommentsRepository } from './comments.repository';
import { MusicService } from '@music/music.service';
import { CommentServiceException } from './exceptions';
import { Transactional } from '@nestjs-cls/transactional';

@Injectable()
export class CommentsService {
    private readonly logger = new Logger(CommentsService.name);
    constructor(
        private readonly commentRepository: CommentsRepository,
        private readonly musicService: MusicService,
    ) {}

    @Transactional()
    async create(createCommentDto: CreateCommentDto, user: User) {
        await this.musicService.checkOwnerBybundleMusicId(createCommentDto.bundle_music_fk, user);

        const comment = await this.commentRepository.create(createCommentDto); 

        return comment;
    }

    async findManyByBundleMusicId(bundleMusicId: number, user: User) {
        await this.musicService.checkOwnerBybundleMusicId(bundleMusicId, user);

        return await this.commentRepository.findManyByBundleMusicId(bundleMusicId);
    }

    @Transactional()
    async remove(commentId: number, user: User) {
        await this.checkOwner(commentId, user);

        return await this.commentRepository.remove(commentId);
    }

    async checkOwner(commentId: number, user: User) {
        const isOwner = await this.commentRepository.checkOwnerByCommentId(commentId, user.user_no);
        
        if (!isOwner) {
            throw CommentServiceException.COMMENT_FORBIDDEN;
        }
    }
}
