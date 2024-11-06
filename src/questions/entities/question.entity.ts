import { 
    Entity, 
    Column, 
    PrimaryGeneratedColumn, 
    CreateDateColumn, 
    UpdateDateColumn, 
    ManyToOne 
  } from 'typeorm';
  import { Task } from '../../tasks/entities/task.entity';
import { Note } from 'src/notes/entities/notes.entity';
import { User } from 'src/user/user.entity';
  
  @Entity()
  export class Question {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column('text')
    question: string;
  
    @Column('text', { nullable: true })
    answer: string;
  
    @ManyToOne(() => Note, note => note.questions)
    note: Note;
  
    @ManyToOne(() => Task, task => task.questions, { nullable: true })
    task: Task;
  
    @ManyToOne(() => User)
    askedTo: User;
  
    @ManyToOne(() => User)
    askedBy: User;
  
    @ManyToOne(() => User, { nullable: true })
    answeredBy: User;
  
    @ManyToOne(() => User)
    updatedBy: User;
  
    @Column({ type: 'timestamp', nullable: true })
    answeredAt: Date;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  
    @Column({ default: true })
    isActive: boolean;
  }
  