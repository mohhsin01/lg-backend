import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn,OneToMany } from 'typeorm';
import { User } from '../users/users.entity';
import { Interview } from '../interviews/interviews.entity';

@Entity('jobs')
export class Job {
  @PrimaryGeneratedColumn()
  job_id: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ default: 'open' })
  status: string;

  @Column({ type: 'decimal', nullable: true })
  job_salary: number;

  @Column()
  location: string;

  // BD who created this job (Foreign key)
  @ManyToOne(() => User, (user) => user.jobs, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

 
  @Column({ nullable: true })
  dev_id: number;

  @OneToMany(() => Interview, (interview) => interview.job)
interviews: Interview[];

}
