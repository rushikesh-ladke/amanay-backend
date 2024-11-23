import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Exclude, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class User {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @ApiProperty()
  @Column()
  firstName: string;

  @ApiProperty()
  @Column()
  lastName: string;

  @ApiProperty()
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({
    description: 'User settings stored as JSON',
    example: {
      theme: 'dark',
      notifications: true,
      language: 'en'
    },
    nullable: true
  })
  @Column({ 
    type: 'jsonb', // Use 'json' if not using PostgreSQL
    nullable: true,
    default: () => "('{}')" // Default empty JSON object
  })
  @Transform(
    ({ value }) => {
      try {
        return typeof value === 'string' ? JSON.parse(value) : value;
      } catch {
        return {};
      }
    },
    { toClassOnly: true }
  )
  settings: Record<string, any>
}
