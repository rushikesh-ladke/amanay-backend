import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users', { database: 'new_database' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  age: number;

  @Column()
  created_at: string;
}
