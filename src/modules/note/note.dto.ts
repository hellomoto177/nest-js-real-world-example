import { IsDefined } from 'class-validator';
import { BaseDTO } from '../../common/base.dto';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { ResponseTagDTO } from '../tag/tag.dto';
import { ResponseGroupDTO } from '../group/group.dto';

// Swagger
const sw = {
  title: { type: String, example: 'Shopping list' },
  content: { type: String, example: '1. Beer; 2. Enough;' },
  group: { type: Number, example: 1 },
  tags: { type: ResponseTagDTO, isArray: true },
  groups: { type: ResponseGroupDTO, isArray: true },
};

export class ResponseNoteDTO extends BaseDTO {
  @ApiModelProperty(sw.title)
  title: string;
  @ApiModelProperty(sw.content)
  content: string;
  @ApiModelProperty(sw.group)
  groupId: number;
  @ApiModelPropertyOptional(sw.tags)
  tags?: ResponseTagDTO[];
  @ApiModelPropertyOptional(sw.groups)
  groups?: ResponseGroupDTO[];
}

export class CreateNoteDTO {
  @ApiModelProperty(sw.title)
  title: string;
  @ApiModelProperty(sw.content)
  content: string;
  @IsDefined()
  @ApiModelProperty(sw.group)
  groupId: number;
}

export class UpdateNoteDTO {
  @ApiModelProperty(sw.title)
  title?: string;
  @ApiModelProperty(sw.content)
  content?: string;
  @ApiModelProperty(sw.group)
  groupId?: number;
}
