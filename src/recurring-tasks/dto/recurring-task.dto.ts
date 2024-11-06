import { IsEnum, IsDate, IsOptional, IsBoolean, IsUUID, IsObject } from 'class-validator';
import { Type } from 'class-transformer';
import { RecurringFrequency } from '../entities/recurring-task.entity';

export class CreateRecurringTaskDto {
  @IsEnum(RecurringFrequency)
  frequency: RecurringFrequency;

  @IsDate()
  @Type(() => Date)
  scheduledDate: Date;

  @IsObject()
  @IsOptional()
  metadata?: {
    dayOfWeek?: number;
    dayOfMonth?: number;
    monthOfYear?: number;
  };
}

export class UpdateRecurringTaskDto {
  @IsEnum(RecurringFrequency)
  @IsOptional()
  frequency?: RecurringFrequency;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  scheduledDate?: Date;

  @IsObject()
  @IsOptional()
  metadata?: {
    dayOfWeek?: number;
    dayOfMonth?: number;
    monthOfYear?: number;
  };
}

export class CompleteRecurringTaskDto {
  @IsBoolean()
  isCompleted: boolean;
}
