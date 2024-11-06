import { IsUUID, IsEnum, IsBoolean, IsOptional } from 'class-validator';
import { AccessType } from '../entities/note-access.entity';

export class CreateNoteAccessDto {
  @IsUUID()
  userId: string;

  @IsEnum(AccessType)
  @IsOptional()
  accessType?: AccessType;
}

export class UpdateNoteAccessDto {
  @IsEnum(AccessType)
  @IsOptional()
  accessType?: AccessType;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
