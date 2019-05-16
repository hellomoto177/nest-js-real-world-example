import { IsDefined, MinLength, IsEmail } from 'class-validator';
import { BaseDTO } from '../../common/base.dto';

export class ResponseAuthDTO extends BaseDTO {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export class CreateUserDTO {
  @IsDefined()
  @IsEmail()
  email: string;
  @IsDefined()
  @MinLength(8)
  password: string;
  @IsDefined()
  firstName: string;
  @IsDefined()
  lastName: string;
}

export class UpdateUserDTO {
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
}