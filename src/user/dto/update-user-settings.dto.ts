// src/user/dto/update-user-settings.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsOptional } from 'class-validator';

export class UpdateUserSettingsDto {
  @ApiProperty({
    description: 'User settings object',
    example: {
      theme: 'dark',
      notifications: true,
      language: 'en'
    }
  })
  @IsObject()
  @IsOptional()
  settings: Record<string, any>;
}