import { IsNotEmpty, IsString } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';
import { BaseDTO } from '../../common/base.dto';

export class ResponseGroupDTO extends BaseDTO {
  @ApiModelProperty({ type: String })
  title: string;
}

export class CreateGroupDTO {
  @ApiModelProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  title: string;
}

export class UpdateGroupDTO {
  @ApiModelProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  title: string;
}
