import {
    Controller, Get, Post, Body,
    UseGuards,
    Param,
    ParseIntPipe,
    Delete,
    HttpCode,
    HttpStatus,
    Logger, 
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentBody } from './dto/create-comment.body';
import { reqUser } from '@auth/auth.decorator';
import { User } from '@user/entities/user.entity';
import { JwtAuthGuard } from '@auth/auth.guard';
import { CreateCommentDto } from './dto/create-comment-dto';

@UseGuards(JwtAuthGuard)
@Controller('comments')
export class CommentsController {
    private readonly logger = new Logger(CommentsController.name);

    constructor(
        private readonly commentsService: CommentsService
    ) {}
    
    @Post(':bundleMusicId')
    @HttpCode(HttpStatus.CREATED)
    async create(
        @Param('bundleMusicId', ParseIntPipe) bundleMusicId: number, 
        @Body() createCommentBody: CreateCommentBody,
        @reqUser() user: User
    ) {
        const createCommentDto = CreateCommentDto.of(bundleMusicId, createCommentBody);
        return await this.commentsService.create(createCommentDto, user);
    }

    @Get(':bundleMusicId')
    async findManyByBundleMusicId(
        @Param('bundleMusicId', ParseIntPipe) bundleMusicId: number,
        @reqUser() user: User
    ) {
        return await this.commentsService.findManyByBundleMusicId(bundleMusicId, user);
    }

    @Delete(':comment_id')
    async remove(
        @Param('comment_id', ParseIntPipe) commentId: number,
        @reqUser() user: User
    ) {
        return await this.commentsService.remove(commentId, user);
    }
}
