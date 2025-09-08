import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Post } from '../posts/post.entity';

@Entity('users') 
export class User {
  @PrimaryGeneratedColumn() 
  id: number;

  @Column({ unique: true }) 
  email: string;

  @Column({ length: 100 }) 
  name: string;

  @Column() 
  password: string;

  @Column()
  role:string

  @Column({ default: true }) 
  isActive: boolean;


  @OneToMany(() => Post, post => post.user, { cascade: true, onDelete: 'CASCADE' })
  posts: Post[];

    
}
