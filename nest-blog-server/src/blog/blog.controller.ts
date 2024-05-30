import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Body,
  Patch,
  ParseIntPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { BlogService } from './blog.service';
import { AuthGuard } from 'src/user/user.guard';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}
  // @Get('test')
  // async test() {
  //   throw new HttpException('test', HttpStatus.BAD_REQUEST);
  // }

  @Get()
  async findAll(
    @Query('keyword') keyword: string,
    @Query('author') author: string,
  ) {
    return await this.blogService.findAll(author, keyword);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const blog = await this.blogService.findOne(id);
    return blog;
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.blogService.remove(id);
  }

  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() createBlogDto: CreateBlogDto, @Request() req: any) {
    createBlogDto.author = req.user.username;
    const res = await this.blogService.create(createBlogDto);
    return res;
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBlogDto: CreateBlogDto,
  ) {
    return await this.blogService.update(id, updateBlogDto);
  }
}
