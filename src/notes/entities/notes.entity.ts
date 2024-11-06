import { 
  Entity, 
  Column, 
  PrimaryGeneratedColumn, 
  CreateDateColumn, 
  UpdateDateColumn, 
  ManyToOne, 
  OneToMany 
} from 'typeorm';
import { User } from '../../user/user.entity';
import { Task } from '../../tasks/entities/task.entity';
import { NoteAccess } from '../../note-access/entities/note-access.entity';
import { RecurringTask } from '../../recurring-tasks/entities/recurring-task.entity';
import { Question } from '../../questions/entities/question.entity';

export enum NoteType {
  NOTE = 'NOTE',
  CALL = 'CALL',
  QUESTION = 'QUESTION'
}

@Entity()
export class Note {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  nameId: string;

  @Column('text', { array: true, default: [] })
  tags: string[];

  @Column('text')
  content: string;

  @Column('text', { array: true, default: [] })
  links: string[];

  @Column('text', { nullable: true })
  discussedWith: string;

  @Column({ default: false })
  isRecurring: boolean;

  @Column({ default: false })
  isAnalytical: boolean;

  @Column({
    type: 'enum',
    enum: NoteType,
    default: NoteType.NOTE
  })
  noteType: NoteType;

  @ManyToOne(() => User)
  createdBy: User;

  @ManyToOne(() => User)
  updatedBy: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Task, task => task.note)
  tasks: Task[];

  @OneToMany(() => Question, question => question.note)
  questions: Question[];

  @OneToMany(() => NoteAccess, access => access.note)
  userAccess: NoteAccess[];

  @OneToMany(() => RecurringTask, recurring => recurring.task)
  recurringLogs: RecurringTask[];
}
