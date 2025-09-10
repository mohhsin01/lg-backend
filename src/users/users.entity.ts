import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  role: string;

  @Column({ nullable: true })
  education: string;

  @Column({ nullable: true })
  skill: string;

  @Column({ nullable: true })
  experience: string;

  @Column({ nullable: true })
  phone: string;
}
