import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Job } from '../jobs/jobs.entity';

@Injectable()
export class JobUpdateGuard implements CanActivate {
  constructor(
    @InjectRepository(Job)
    private readonly jobRepository: Repository<Job>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    
    // Remove quotes and trim whitespace from role
    const role = request.headers['role']?.toString()
      .replace(/^["']|["']$/g, '') // Remove leading/trailing quotes
      .trim()
      .toLowerCase();
    
    // Remove quotes and parse bd_id
    const bdId = request.headers['bd_id']
      ? parseInt(request.headers['bd_id'].toString().replace(/^["']|["']$/g,'').trim()): null;
      
    const jobId = parseInt(request.params.id);

    
    if (role === 'admin') {
      return true;
    }

   
    if (role === 'bd') {
      if (!bdId) {
        throw new ForbiddenException('BD ID is required for BD role');
      }

      const job = await this.jobRepository.findOne({
        where: { job_id: jobId },
        relations: ['user'],
      });

      if (!job) {
        throw new ForbiddenException('Job not found');
      }

      if (job.user.id !== bdId) {
        throw new ForbiddenException(
          'Only the owning BD can update this job',
        );
      }

      return true;
    }

    throw new ForbiddenException('Invalid role');
  }
}