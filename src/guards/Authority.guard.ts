import { CanActivate,ExecutionContext, Injectable,ForbiddenException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Job } from '../jobs/jobs.entity';
import { Interview } from '../interviews/interviews.entity';
import { User } from '../users/users.entity';

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




@Injectable()
export class interviewViewGuard implements CanActivate {
  constructor(
    @InjectRepository(Interview)
    private readonly interviewRepository: Repository<Interview>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    
    // Remove quotes and trim whitespace from role
    const role = request.headers['role']?.toString()
      .replace(/^["']|["']$/g, '') // Remove leading/trailing quotes
      .trim()
      .toLowerCase();
    
    // Remove quotes and parse bd_id
    const dev_Id = request.headers['dev_id']
      ? parseInt(request.headers['dev_id'].toString().replace(/^["']|["']$/g,'').trim()): null;
      
    const interviewId = parseInt(request.params.id);

    
    if (role === 'admin') {
      return true;
    }

   
    if (role === 'developer') {
      if (!dev_Id) {
        throw new ForbiddenException('Developer ID is required for BD role');
      }

      const interv = await this.interviewRepository.findOne({
        where: { id: interviewId },
        relations: ['user'],
      });

      if (!interv) {
        throw new ForbiddenException('Interview not found');
      }

      if (interv.user.id !== dev_Id) {
        throw new ForbiddenException(
          'Only the owning Developer can view this interview',
        );
      }

      return true;
    }

    throw new ForbiddenException('Invalid role');
  }
}
@Injectable()
export class InterviewAssignGuard implements CanActivate {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { user_id } = request.body;  // <-- fix here

    if (!user_id) {
      throw new ForbiddenException('User ID is required in the body');
    }

    const foundUser = await this.userRepository.findOne({
      where: { id: user_id },
    });

    if (!foundUser) {
      throw new ForbiddenException('User not found');
    }

    if (
      foundUser.role?.toLowerCase() !== 'developer' &&
      foundUser.role?.toLowerCase() !== 'dev'
    ) {
      throw new ForbiddenException(
        'Interviews can only be assigned to developers',
      );
    }

    return true;
  }
}
