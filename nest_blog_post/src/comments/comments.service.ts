import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { User } from '../users/user.entity';
import { Post } from '../posts/post.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,
    @InjectRepository(Post) private readonly postRepo: Repository<Post>,
  ) {}

  async createComment(
    postId: string,
    dto: CreateCommentDto,
    user: User,
  ): Promise<Comment> {
    const post = await this.postRepo.findOne({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const comment = this.commentRepo.create({
      content: dto.content,
      author: user,
      post: post,
    });
    return await this.commentRepo.save(comment);
  }

  async getCommentsByPost(postId: string): Promise<Comment[]> {
    return await this.commentRepo.find({
      where: { post: { id: postId } },
      order: { createdAt: 'DESC' },
      relations: ['author', 'post'],
    });
  }

  async deleteComment(commentId: string, user: User): Promise<Comment> {
    const comment = await this.commentRepo.findOne({
      where: { id: commentId },
      relations: ['author', 'post'],
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    if (!comment.author || comment.author.id !== user.id) {
      throw new ForbiddenException("Cannot delete other's comments");
    }

    await this.commentRepo.delete(commentId);
    return comment;
  }
}
