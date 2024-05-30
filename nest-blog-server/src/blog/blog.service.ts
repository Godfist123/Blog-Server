import { Injectable } from '@nestjs/common';
import { Blog } from './blog.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { CreateBlogDto } from './dto/create-blog.dto';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(Blog)
    private readonly blogRepository: Repository<Blog>,
  ) {}

  async findAll(author: string = '', keyword: string = '') {
    const condition = {};
    if (author) {
      condition['author'] = author;
    }
    if (keyword) {
      condition['title'] = Like(`%${keyword}%`);
    }
    return await this.blogRepository.find({
      where: condition,
      order: { createdAt: 'DESC' },
    });
  }
  async findOne(id: number) {
    return await this.blogRepository.findOneBy({ id });
  }

  async create(blog: CreateBlogDto) {
    return await this.blogRepository.save(blog);
  }

  async remove(id: number) {
    return await this.blogRepository.delete(id);
  }
  async update(id: number, blog: CreateBlogDto) {
    return await this.blogRepository.update(id, blog);
  }
}
