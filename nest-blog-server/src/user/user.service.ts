import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async findOne(loginUserDto: LoginUserDto) {
    const { username, password } = loginUserDto;
    const user = await this.userRepository.findOne({
      where: { username, password },
    });
    if (user == null) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    const payload = {
      username: user.username,
      id: user.id,
      realname: user.realname,
    };
    return {
      token: await this.jwtService.signAsync(payload),
    };
  }
}
