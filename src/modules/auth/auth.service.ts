import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { UserService } from '../user/user.service';
import { ResponseUserDTO } from '../user/user.dto';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  signPayload(user: ResponseUserDTO) {
    // TODO: take it from config service
    const expiresIn = 3600;

    const accessToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
        firstname: user.firstName,
        lastname: user.lastName,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      'ItIsNotASecret',
      { expiresIn },
    );

    return accessToken;
  }

  // TODO: replace any on JwtPayload type
  async validateUser(payload: any): Promise<any> {
    return await this.userService.findById(payload.id);
  }
}
