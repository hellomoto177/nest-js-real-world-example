import { IsDefined } from 'class-validator';
import { BaseDTO } from '../../common/base.dto';
import { ApiModelProperty } from '@nestjs/swagger';

export class ResponseNoteDTO extends BaseDTO {
  @ApiModelProperty({ type: String })
  title: string;
  @ApiModelProperty({ type: String })
  content: string;
  @ApiModelProperty({ type: Number })
  groupId: number;
  tags?: any[];
  notes?: any[];
}

export class CreateNoteDTO {
  @ApiModelProperty({ type: String })
  title: string;
  @ApiModelProperty({ type: String })
  content: string;
  @IsDefined()
  @ApiModelProperty({ type: Number })
  groupId: number;
}

export class UpdateNoteDTO {
  @ApiModelProperty({ type: String })
  title?: string;
  @ApiModelProperty({ type: String })
  content?: string;
  @ApiModelProperty({ type: Number })
  groupId?: number;
}
