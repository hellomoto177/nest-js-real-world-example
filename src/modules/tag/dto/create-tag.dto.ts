import { IsDefined } from 'class-validator';

export class CreateTagDTO {
  @IsDefined()
  name: string;
}
