import { IsDefined } from 'class-validator';

export class CreateNoteDTO {
  title: string;
  content: string;
  @IsDefined()
  groupId: number;
}
