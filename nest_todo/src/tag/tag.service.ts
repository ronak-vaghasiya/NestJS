import { Injectable } from '@nestjs/common';
import { Tag } from '../common/entity/tag.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  async createTag(name: string): Promise<Tag> {
    const newTag = this.tagRepository.create({ name });
    return await this.tagRepository.save(newTag);
  }

  async getAllTags(): Promise<Tag[]> {
    return await this.tagRepository.find();
  }

  async deleteTag(id: string): Promise<{ message: string }> {
    const tag = await this.tagRepository.findOne({ where: { id } });
    if (!tag) {
      throw new Error('Tag not found');
    }
    await this.tagRepository.remove(tag);
    return { message: 'Tag deleted successfully' };
  }
}
