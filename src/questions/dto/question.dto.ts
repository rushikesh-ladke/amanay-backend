import { IsString, IsOptional, IsUUID } from 'class-validator';

export class CreateQuestionDto {
  @IsString()
  question: string;

  @IsUUID()
  askedToId: string;

  @IsUUID()
  noteId: string;

  @IsUUID()
  @IsOptional()
  taskId?: string;
}

export class UpdateQuestionDto {
  @IsString()
  @IsOptional()
  question?: string;

  @IsString()
  @IsOptional()
  answer?: string;

  @IsUUID()
  @IsOptional()
  askedToId?: string;
}

export class AnswerQuestionDto {
  @IsString()
  answer: string;
}
