import {
  Controller,
  Post,
  Get,
  Param,
  UseGuards,
  Request,
  ParseUUIDPipe,
} from '@nestjs/common';
import { LikesService } from './likes.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post(':postId')
  toggleLike(
    @Param('postId', ParseUUIDPipe) postId: string,
    @Request() req: { user: any },
  ) {
    return this.likesService.toggleLike(postId, req.user);
  }

  @Get('count/:postId')
  countLikes(@Param('postId', ParseUUIDPipe) postId: string) {
    return this.likesService.countLikes(postId);
  }

  @Get('users/:postId')
  getUsersWhoLiked(@Param('postId', ParseUUIDPipe) postId: string) {
    return this.likesService.getUsersWhoLiked(postId);
  }
}
