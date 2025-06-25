import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
  ParseUUIDPipe,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../users/user.entity';

@Controller('posts')
@UseGuards(AuthGuard('jwt'))
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  getAllPosts() {
    return this.postsService.findAll();
  }

  @Get(':id')
  getPost(@Param('id', ParseUUIDPipe) id: string) {
    return this.postsService.findOne(id);
  }

  @Post()
  createPost(@Body() dto: CreatePostDto, @Request() req: { user: User }) {
    return this.postsService.createPost(dto, req.user);
  }

  @Post('update/:id')
  updatePost(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePostDto,
    @Request() req: { user: User },
  ) {
    return this.postsService.updatePost(id, dto, req.user);
  }

  @Delete(':id')
  deletePost(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: { user: User },
  ) {
    return this.postsService.deletePost(id, req.user);
  }
}
