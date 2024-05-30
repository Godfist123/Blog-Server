import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthGuard } from './user.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    return await this.userService.findOne(loginUserDto);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  async profile(@Request() req: any) {
    return req.user;
  }
}
