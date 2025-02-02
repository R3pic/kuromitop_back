import {
    Controller,
    UseGuards,
    Param,
    ParseIntPipe,
    Delete,
    Logger,
    HttpCode,
    HttpStatus, 
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { ReqUser } from '@common/decorator/req-user.decorator';
import { JwtAuthGuard } from '@common/guard/auth.guard';
import { RequestUser } from '@common/request-user';
import { RemoveCommentDto } from './domain/dto/remove-comment.dto';
import { routes } from '@common/config/routes';

@UseGuards(JwtAuthGuard)
@Controller(routes.comment.root)
export class CommentsController {
    private readonly logger = new Logger(CommentsController.name);

    constructor(
        private readonly commentsService: CommentsService
    ) {}

    @Delete(routes.comment.detail)
    @HttpCode(HttpStatus.NO_CONTENT)
    async remove(
        @Param('id', ParseIntPipe) id: number,
        @ReqUser() reqUser: RequestUser
    ) {
        const removeCommentDto = new RemoveCommentDto(id, reqUser);

        return await this.commentsService.remove(removeCommentDto);
    }
}
