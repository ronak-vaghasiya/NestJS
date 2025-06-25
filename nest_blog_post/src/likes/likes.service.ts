import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like } from './like.entity';
import { Post } from '../posts/post.entity';
import { User } from '../users/user.entity';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Like) private likeRepo: Repository<Like>,
    @InjectRepository(Post) private postRepo: Repository<Post>,
  ) {}

  async toggleLike(postId: string, user: User): Promise<{ liked: boolean }> {
    const post = await this.postRepo.findOne({ where: { id: postId } });
    if (!post) throw new NotFoundException('Post not found');

    const existing = await this.likeRepo.findOne({
      where: { post: { id: postId }, user: { id: user.id } },
      relations: ['post', 'user'],
    });

    if (existing) {
      await this.likeRepo.remove(existing);
      return { liked: false };
    } else {
      const like = this.likeRepo.create({ post, user });
      await this.likeRepo.save(like);
      return { liked: true };
    }
  }

  async countLikes(postId: string): Promise<{ count: number }> {
    const count = await this.likeRepo.count({
      where: { post: { id: postId } },
    });
    return { count };
  }

  async getUsersWhoLiked(postId: string): Promise<User[]> {
    const likes = await this.likeRepo.find({
      where: { post: { id: postId } },
      relations: ['user'],
    });
    return likes.map((like) => like.user);
  }
}
