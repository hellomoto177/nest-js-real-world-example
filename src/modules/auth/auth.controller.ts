import { Controller, Post, Body } from '@nestjs/common';
import { LoginDTO } from './auth.dto';
import { AuthService } from './auth.service';
import { CreateUserDTO } from '../user/user.dto';
import { UserService } from '../user/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('login')
  async login(@Body() dto: LoginDTO) {
    const user = await this.userService.findByPayload(dto);
    const token = this.authService.signPayload(user);
    return { user, token };
  }

  @Post('register')
  async register(@Body() dto: CreateUserDTO) {
    const user = await this.userService.create(dto);
    const token = this.authService.signPayload(user);
    return { user, token };
  }
}
