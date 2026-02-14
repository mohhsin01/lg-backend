import { Injectable, CanActivate, ExecutionContext, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/users.entity';
import { Job } from '../jobs/jobs.entity';

@Injectable()
export class InterviewValidationGuard implements CanActivate {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Job)
    private readonly jobRepo: Repository<Job>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const body = request.body;

    if (body.user_id || body.job_id) {
     
      if (body.user_id) {
        const user = await this.userRepo.findOne({ where: { id: body.user_id } });
        if (!user) {
          throw new NotFoundException('User not found');
        }
      }

     
      if (body.job_id) {
        const job = await this.jobRepo.findOne({ where: { job_id: body.job_id } });
        if (!job) {
          throw new NotFoundException('Job not found');
        }
      }
    }

    return true;
  }
}