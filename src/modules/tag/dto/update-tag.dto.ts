import { IsDefined } from 'class-validator';

export class UpdateTagDTO {
  @IsDefined()
  name: string;
}
