import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum NoteType {
  NOTE = 'NOTE',
  CALL_NOTE = 'CALL_NOTE'
}

export enum VisibilityType {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
  SHARED = 'SHARED'
}

@Entity('notes')
export class Note {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 255, name: 'name_id' })
  nameId: string;

  @Column({ type: 'text', nullable: true })
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ length: 255 })
  createdBy: string;

  @Column({
    type: 'enum',
    enum: NoteType,
    default: NoteType.NOTE
  })
  noteType: NoteType;

  @Column('simple-array', { nullable: true })
  relatedLinks: string[];

  @Column('simple-array', { nullable: true })
  dependencies: string[];

  @Column('simple-array', { nullable: true })
  blockedBy: string[];

  @Column('simple-array', { nullable: true })
  questions: string[];

  @Column('simple-array', { nullable: true })
  tags: string[];

  @Column({ length: 100, nullable: true })
  status: string;

  @Column({ type: 'timestamp', nullable: true })
  startDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  endDate: Date;

  @Column('simple-array', { nullable: true })
  discussedWith: string[];

  @Column('simple-array', { nullable: true })
  sharedWith: string[];

  @Column({
    type: 'enum',
    enum: VisibilityType,
    default: VisibilityType.PRIVATE
  })
  visibility: VisibilityType;
}
