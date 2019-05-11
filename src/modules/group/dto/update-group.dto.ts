import { IsNotEmpty, IsString } from 'class-validator';

export default class UpdateGroupDTO {
  @IsString()
  @IsNotEmpty()
  title: string;
}
