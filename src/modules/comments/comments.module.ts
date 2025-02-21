import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { CommentsRepository } from './comments.repository';
import { PostgresModule } from '@common/database/postgres.module';
import { CommentMapper } from './comment.mapper';

@Module({
  imports: [PostgresModule],
  exports: [CommentsService],
  controllers: [CommentsController],
  providers: [ 
    CommentsService,
    CommentMapper,
    CommentsRepository,
  ],
})
export class CommentsModule {}
