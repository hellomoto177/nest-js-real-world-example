import { Controller, Post, Body, Get } from '@nestjs/common';
import { LoginDTO, RegisterDTO, ResponseUserDTO } from './user.dto';

@Controller('user')
export class UserController {
  @Get('/test')
  index() {
    return 'dada';
  }

  @Post('/login')
  login(@Body() dto: LoginDTO) {
    return 'something';
  }

  @Post('/register')
  register(@Body() dto: RegisterDTO) {
    return dto;
  }
}
