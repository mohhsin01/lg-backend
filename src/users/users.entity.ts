import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Job } from '../jobs/jobs.entity';
import { Interview } from '../interviews/interviews.entity';

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

  // One user (BD) can create many jobs
  @OneToMany(() => Job, (job) => job.user)
  jobs: Job[];

  @OneToMany(() => Interview, (interview) => interview.user)
interviews: Interview[];

}
