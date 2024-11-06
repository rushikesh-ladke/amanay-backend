import { 
    Entity, 
    Column, 
    PrimaryGeneratedColumn, 
    CreateDateColumn, 
    UpdateDateColumn, 
    ManyToOne 
  } from 'typeorm';
  import { User } from '../../user/user.entity';
  import { Task } from '../../tasks/entities/task.entity';
  
  export enum RecurringFrequency {
    DAILY = 'DAILY',
    WEEKLY = 'WEEKLY',
    BIWEEKLY = 'BIWEEKLY',
    MONTHLY = 'MONTHLY',
    QUARTERLY = 'QUARTERLY',
    YEARLY = 'YEARLY'
  }
  
  @Entity()
  export class RecurringTask {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @ManyToOne(() => Task, task => task.id)
    task: Task;
  
    @Column({ 
      type: 'enum',
      enum: RecurringFrequency,
      default: RecurringFrequency.WEEKLY 
    })
    frequency: RecurringFrequency;
  
    @Column({ type: 'timestamp' })
    scheduledDate: Date;
  
    @Column({ type: 'timestamp', nullable: true })
    completedDate: Date;
  
    @Column({ default: false })
    isCompleted: boolean;
  
    @ManyToOne(() => User)
    createdBy: User;
  
    @ManyToOne(() => User)
    updatedBy: User;
  
    @ManyToOne(() => User, { nullable: true })
    completedBy: User;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  
    @Column({ default: true })
    isActive: boolean;
  
    @Column({ type: 'jsonb', nullable: true })
    metadata: {
      dayOfWeek?: number;
      dayOfMonth?: number;
      monthOfYear?: number;
    };
  }
  