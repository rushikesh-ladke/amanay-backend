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
  import { Note } from '../../notes/entities/notes.entity';
  import { Question } from '../../questions/entities/question.entity';
  import { TaskSOP } from '../../task-sop/entities/task-sop.entity';
  
  export enum TaskPriority {
    CRITICAL = 'CRITICAL',
    HIGH = 'HIGH',
    MEDIUM = 'MEDIUM',
    LOW = 'LOW'
  }
  
  export enum TaskStatus {
    BACKLOG = 'BACKLOG',
    TODO = 'TODO',
    IN_PROGRESS = 'IN_PROGRESS',
    IN_REVIEW = 'IN_REVIEW',
    DONE = 'DONE',
    ARCHIVED = 'ARCHIVED'
  }
  
  @Entity()
  export class Task {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column()
    title: string;
  
    @Column('text')
    content: string;
  
    @Column({ nullable: true })
    sprint: string;
  
    @Column({ type: 'timestamp', nullable: true })
    actualDueDate: Date;
  
    @Column({ type: 'timestamp', nullable: true })
    artificialDueDate: Date;
  
    @ManyToOne(() => User)
    assignee: User;
  
    @ManyToOne(() => User)
    reporter: User;
  
    @ManyToOne(() => User)
    createdBy: User;
  
    @ManyToOne(() => User)
    updatedBy: User;
  
    @ManyToOne(() => User, { nullable: true })
    completedBy: User;
  
    @Column({
      type: 'enum',
      enum: TaskPriority,
      default: TaskPriority.MEDIUM
    })
    priority: TaskPriority;
  
    @Column('text', { array: true, default: [] })
    tags: string[];
  
    @Column('decimal', { precision: 10, scale: 2, nullable: true })
    originalEstimate: number;
  
    @Column('decimal', { precision: 10, scale: 2, nullable: true })
    requiredTime: number;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  
    @Column({ type: 'timestamp', nullable: true })
    completedOn: Date;
  
    @Column({
      type: 'enum',
      enum: TaskStatus,
      default: TaskStatus.BACKLOG
    })
    status: TaskStatus;
  
    @Column({ nullable: true })
    pomodoroExpected: number;
  
    @Column({ nullable: true })
    pomodoroRequired: number;
  
    @ManyToOne(() => Note, note => note.tasks)
    note: Note;
  
    @Column({ type: 'int', default: 5 })
    energyLevelRequired: number;
  
    @Column({ type: 'int', default: 5 })
    difficultyLevel: number;
  
    @Column({ default: false })
    isDelegated: boolean;
  
    @Column({ default: true })
    isActive: boolean;
  
    @OneToMany(() => TaskSOP, sop => sop.task)
    sops: TaskSOP[];
  
    @OneToMany(() => Question, question => question.task)
    questions: Question[];
      recurringParent: any;
      recurringLogs: any;
  }
  