import { IsNotEmpty, IsString } from 'class-validator';
import { BaseDTO } from '../../../common/base.dto';

export default class UpdateGroupDTO extends BaseDTO {
  @IsString()
  @IsNotEmpty()
  title: string;
}
