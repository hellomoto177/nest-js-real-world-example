import { IsNotEmpty, IsString } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';
import { BaseDTO } from '../../../common/base.dto';

export default class CreateGroupDTO extends BaseDTO {
  @ApiModelProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  title: string;
}
