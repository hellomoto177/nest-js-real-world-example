import { IsDefined } from 'class-validator';
import { ResponseNoteDTO } from '../note/note.dto';
import { ApiModelProperty } from '@nestjs/swagger';

export class ResponseTagDTO {
  @ApiModelProperty({ type: String })
  name: string;
  @ApiModelProperty({ type: ResponseNoteDTO, isArray: true })
  notes?: ResponseNoteDTO[];
}

export class CreateTagDTO {
  @IsDefined()
  @ApiModelProperty({ type: String })
  name: string;
}

export class UpdateTagDTO {
  @IsDefined()
  @ApiModelProperty({ type: String })
  name: string;
}
