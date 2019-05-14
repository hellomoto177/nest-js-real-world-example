import { IsNotEmpty, IsString } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';
import { BaseDTO } from '../../common/base.dto';

// Swagger
const sw = {
  title: { type: String, example: 'TODO' },
};

export class ResponseGroupDTO extends BaseDTO {
  @ApiModelProperty(sw.title)
  title: string;
}

export class CreateGroupDTO {
  @ApiModelProperty(sw.title)
  @IsString()
  @IsNotEmpty()
  title: string;
}

export class UpdateGroupDTO {
  @ApiModelProperty(sw.title)
  @IsString()
  @IsNotEmpty()
  title: string;
}
