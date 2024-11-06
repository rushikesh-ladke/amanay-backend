import { IsString, IsArray, IsBoolean, IsOptional, IsEnum, IsUUID } from 'class-validator';
import { NoteType } from '../entities/notes.entity';

export class CreateNoteDto {
  @IsString()
  name: string;

  @IsString()
  nameId: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsString()
  content: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  links?: string[];

  @IsString()
  @IsOptional()
  discussedWith?: string;

  @IsBoolean()
  @IsOptional()
  isRecurring?: boolean;

  @IsBoolean()
  @IsOptional()
  isAnalytical?: boolean;

  @IsEnum(NoteType)
  @IsOptional()
  noteType?: NoteType;
}

export class UpdateNoteDto extends CreateNoteDto {
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class NoteAccessDto {
  @IsUUID()
  userId: string;
}
