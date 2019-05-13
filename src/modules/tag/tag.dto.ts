import { IsDefined } from 'class-validator';
import { ResponseNoteDTO } from '../note/note.dto';

export class ResponseTagDTO {
  name: string;
  notes?: ResponseNoteDTO[];
}

export class CreateTagDTO {
  @IsDefined()
  name: string;
}

export class UpdateTagDTO {
  @IsDefined()
  name: string;
}
