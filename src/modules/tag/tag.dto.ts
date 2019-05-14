import { IsDefined } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

// Swagger
const sw = {
  id: { type: Number, example: 1 },
  name: { type: String, example: 'important' },
};

export class ResponseTagDTO {
  @ApiModelProperty(sw.id)
  id: number;
  @ApiModelProperty(sw.name)
  name: string;
}

export class CreateTagDTO {
  @IsDefined()
  @ApiModelProperty(sw.name)
  name: string;
}

export class UpdateTagDTO {
  @IsDefined()
  @ApiModelProperty(sw.name)
  name: string;
}
