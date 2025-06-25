import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { User } from '../users/user.entity';

@Injectable()
export class PostsService {
  constructor(@InjectRepository(Post) private postRepo: Repository<Post>) {}

  createPost(dto: CreatePostDto, author: User): Promise<Post> {
    const post = this.postRepo.create({ ...dto, author });
    return this.postRepo.save(post);
  }

  findAll(): Promise<Post[]> {
    return this.postRepo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<Post> {
    const post = await this.postRepo.findOne({ where: { id } });
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  async updatePost(id: string, dto: UpdatePostDto, user: User): Promise<Post> {
    const post = await this.findOne(id);
    if (!post.author || post.author.id !== user.id) {
      throw new ForbiddenException('You cannot edit this post');
    }

    Object.assign(post, dto);
    return this.postRepo.save(post);
  }

  async deletePost(id: string, user: User): Promise<Post> {
    const post = await this.findOne(id);
    if (!post.author || post.author.id !== user.id) {
      throw new ForbiddenException('You cannot delete this post');
    }

    await this.postRepo.delete(id);
    return post;
  }
}
