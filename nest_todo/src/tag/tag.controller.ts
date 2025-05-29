import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { TagService } from './tag.service';

@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Post('/create')
  createTag(@Body('name') name: string) {
    return this.tagService.createTag(name);
  }

  @Get('/all')
  getAllTags() {
    return this.tagService.getAllTags();
  }

  @Delete('/delete/:id')
  deleteTag(@Param('id') id: string) {
    return this.tagService.deleteTag(id);
  }
}
