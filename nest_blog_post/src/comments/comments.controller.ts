import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  Request,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post(':postId')
  create(
    @Param('postId', ParseUUIDPipe) postId: string,
    @Body() dto: CreateCommentDto,
    @Request() req: { user: any },
  ) {
    return this.commentsService.createComment(postId, dto, req.user);
  }

  @Get('post/:postId')
  getComments(@Param('postId', ParseUUIDPipe) postId: string) {
    return this.commentsService.getCommentsByPost(postId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':commentId')
  delete(
    @Param('commentId', ParseUUIDPipe) commentId: string,
    @Request() req: { user: any },
  ) {
    return this.commentsService.deleteComment(commentId, req.user);
  }
}