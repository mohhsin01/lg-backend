import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Job } from './jobs.entity';
import { User } from '../users/users.entity';
import { CreateJobDto } from './dto/create-jobs.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { MailService } from 'src/mails/mails.service';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job)
    private readonly jobRepository: Repository<Job>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

       private readonly mailService: MailService,

  ) {}
async create(createJobDto: CreateJobDto): Promise<Job> {
  const { userId, ...jobData } = createJobDto;
  
  const user = await this.userRepository.findOne({ where: { id: userId } });
  if (!user) {
    throw new NotFoundException(`User with ID ${userId} not found`);
  }

  const job = this.jobRepository.create({
    ...jobData,
    user: user,
  });
  const savedJob = await this.jobRepository.save(job);

  const adminUsers = await this.userRepository.find({
    where: { role: 'admin' },
    select: ['email'],
  });

  
  for (const admin of adminUsers) {
    await this.mailService.sendJobCreatedNotification(admin.email, savedJob.job_id, userId);
  }

  return savedJob;
}

  
  async findAll(): Promise<Job[]> {
    return this.jobRepository.find({
      relations: ['user'],
    });
  }

  async findOne(id: number): Promise<Job | null> {
    const job = await this.jobRepository.findOne({
      where: { job_id: id },
      relations: ['user'],
    });
    
    if (!job) {
      throw new NotFoundException(`Job with ID ${id} not found`);
    }
    
    return job;
  }

  // Find jobs by user ID
  async findByUserId(userId: number): Promise<Job[]> {
    return this.jobRepository.find({
      where: { user: { id: userId } },
      relations: ['user'],
    });
  }

  // Find jobs by developer ID
  async findByDevId(devId: number): Promise<Job[]> {
    return this.jobRepository.find({
      where: { dev_id: devId },
      relations: ['user'],
    });
  }

  async update(id: number, updateData: Partial<Job>): Promise<Job| null> {
    const job = await this.findOne(id);
    
    await this.jobRepository.update(id, updateData);
    
    // Return updated job
    return this.jobRepository.findOne({
      where: { job_id: id },
      relations: ['user'],
    });
  }

   async remove(id: number): Promise<void> {
    try {
      console.log('Removing job ID:', id);
      const result = await this.jobRepository.delete({ job_id: id });
      if (result.affected === 0) {
        throw new NotFoundException(`Job with ID ${id} not found`);
      }
      console.log('Job removed successfully');
    } catch (error) {
      console.error('Error in remove:', error);
      throw error;
    }
  }
  
}