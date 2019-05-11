import { IsNotEmpty, IsString } from 'class-validator';

export default class CreateGroupDTO {
  @IsString()
  @IsNotEmpty()
  title: string;
}
