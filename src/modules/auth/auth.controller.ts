import { Controller, Post, Body } from '@nestjs/common';
import { LoginDTO, RegisterDTO } from './auth.dto';

@Controller('auth')
export class AuthController {
  @Post('/login')
  login(@Body() dto: LoginDTO) {
    return 'something';
  }

  @Post('/register')
  register(@Body() dto: RegisterDTO) {
    return dto;
  }
}
