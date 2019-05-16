import { Controller, Post, Body, Get } from '@nestjs/common';

@Controller('user')
export class UserController {
  @Get('/test')
  index() {
    return 'dada';
  }
}
