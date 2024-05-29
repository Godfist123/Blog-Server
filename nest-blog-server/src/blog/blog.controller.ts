import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Body,
  Patch,
} from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';

@Controller('blog')
export class BlogController {
  @Get()
  async findAll(
    @Query('keyword') keyword: string,
    @Query('author') author: string,
  ) {
    console.log('keyword', keyword);
    console.log('author', author);
    return ['a', 'b', 'c'];
  }
  @Get(':id')
  async findOne(@Param('id') id: string) {
    console.log('id', id);
    return 'aaa';
  }
  @Delete(':id')
  async delete(@Param('id') id: string) {
    console.log('delete id', id);
    return { a: 'esew' };
  }
  @Post()
  async create(@Body() createBlogDto: CreateBlogDto) {
    console.log('createBlogDto', createBlogDto);
    return 'ok';
  }
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateBlogDto: CreateBlogDto) {
    console.log('updateBlogDto', updateBlogDto);
    return 'ok';
  }
}
