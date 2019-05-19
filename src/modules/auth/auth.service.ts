import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { UserService } from '../user/user.service';
import { ResponseUserDTO } from '../user/user.dto';
import { ConfigService } from '../config/config.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  signPayload(user: ResponseUserDTO) {
    const accessToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
        firstname: user.firstName,
        lastname: user.lastName,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      this.configService.authSecret,
      { expiresIn: this.configService.authTokenExpires },
    );

    return accessToken;
  }

  // TODO: replace any on JwtPayload type
  async validateUser(payload: any): Promise<any> {
    return await this.userService.findById(payload.id);
  }
}
