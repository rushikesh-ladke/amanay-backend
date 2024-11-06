import { IsString, IsNumber, IsOptional, IsBoolean, IsArray, Min, IsObject } from 'class-validator';

export class CreateTaskSOPDto {
  @IsNumber()
  @Min(1)
  stepNumber: number;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsNumber()
  @IsOptional()
  estimatedMinutes?: number;

  @IsBoolean()
  @IsOptional()
  isRequired?: boolean;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsObject()
  @IsOptional()
  metadata?: {
    tools?: string[];
    prerequisites?: string[];
    references?: string[];
    notes?: string;
  };
}

export class UpdateTaskSOPDto extends CreateTaskSOPDto {
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class CompleteTaskSOPDto {
  @IsBoolean()
  isCompleted: boolean;
}

export class ReorderTaskSOPDto {
  @IsNumber({}, { each: true })
  stepOrder: number[];
}
