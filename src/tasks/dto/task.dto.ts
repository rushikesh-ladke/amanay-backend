import { IsString, IsEnum, IsArray, IsOptional, IsNumber, IsDate, IsUUID, IsBoolean, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { TaskPriority, TaskStatus } from '../entities/task.entity';

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsString()
  @IsOptional()
  sprint?: string;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  actualDueDate?: Date;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  artificialDueDate?: Date;

  @IsUUID()
  @IsOptional()
  assigneeId?: string;

  @IsUUID()
  noteId: string;

  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsNumber()
  @IsOptional()
  originalEstimate?: number;

  @IsNumber()
  @Min(1)
  @Max(10)
  @IsOptional()
  energyLevelRequired?: number;

  @IsNumber()
  @Min(1)
  @Max(10)
  @IsOptional()
  difficultyLevel?: number;

  @IsNumber()
  @IsOptional()
  pomodoroExpected?: number;
}

export class UpdateTaskDto extends CreateTaskDto {
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @IsNumber()
  @IsOptional()
  requiredTime?: number;

  @IsNumber()
  @IsOptional()
  pomodoroRequired?: number;

  @IsBoolean()
  @IsOptional()
  isDelegated?: boolean;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class CompleteTaskDto {
  @IsNumber()
  requiredTime: number;

  @IsNumber()
  pomodoroRequired: number;
}
