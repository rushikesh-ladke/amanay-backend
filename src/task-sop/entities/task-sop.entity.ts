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
  
  @Entity()
  export class TaskSOP {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @ManyToOne(() => Task, task => task.sops)
    task: Task;
  
    @Column()
    stepNumber: number;
  
    @Column()
    title: string;
  
    @Column('text')
    description: string;
  
    @Column({ type: 'int', default: 0 })
    estimatedMinutes: number;
  
    @Column({ default: false })
    isRequired: boolean;
  
    @Column({ type: 'timestamp', nullable: true })
    completedAt: Date;
  
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
  
    @Column('text', { array: true, default: [] })
    tags: string[];
  
    @Column({ type: 'jsonb', nullable: true })
    metadata: {
      tools?: string[];
      prerequisites?: string[];
      references?: string[];
      notes?: string;
    };
  }
  
  