import { 
    Entity, 
    PrimaryGeneratedColumn, 
    CreateDateColumn, 
    UpdateDateColumn, 
    ManyToOne, 
    JoinColumn,
    Column
  } from 'typeorm';
  import { User } from '../../user/user.entity';
  import { Note } from '../../notes/entities/notes.entity';
  
  export enum AccessType {
    READ = 'READ',
    WRITE = 'WRITE',
    ADMIN = 'ADMIN'
  }
  
  @Entity()
  export class NoteAccess {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @ManyToOne(() => Note, note => note.userAccess)
    @JoinColumn()
    note: Note;
  
    @ManyToOne(() => User)
    @JoinColumn()
    user: User;
  
    @ManyToOne(() => User)
    accessGivenBy: User;
  
    @ManyToOne(() => User)
    updatedBy: User;
  
    @Column({
      type: 'enum',
      enum: AccessType,
      default: AccessType.READ
    })
    accessType: AccessType;
  
    @CreateDateColumn()
    accessGrantedAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  
    @Column({ default: true })
    isActive: boolean;
  }
  
  