import { IsString, IsBoolean, IsEmpty, MinLength } from 'class-validator';

export class CreateFeedbackDTO {
  @IsString()
  readonly authorName: string;

  @IsString()
  readonly authorDescription: string;

  @IsString()
  readonly text: string;

  @IsBoolean()
  readonly isPublished: boolean;
}
