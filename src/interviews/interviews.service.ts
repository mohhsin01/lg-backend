import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Interview } from './interviews.entity';
import { CreateInterviewDto } from './dto/interviews.dto';
import { UpdateInterviewDto } from './dto/update-interview.dto';
import { User } from '../users/users.entity';
import { Job } from '../jobs/jobs.entity';
import { MailService } from '../mails/mails.service';

@Injectable()
export class InterviewsService {
  constructor(
    @InjectRepository(Interview)
    private readonly interviewRepo: Repository<Interview>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    private readonly mailService: MailService,
    
  ) {}

   async create(dto: CreateInterviewDto): Promise<Interview> {
    // ✅ Check if user exists
    const user = await this.userRepo.findOne({ where: { id: dto.user_id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${dto.user_id} not found`);
    }

    // ✅ Create interview entry
    const interview = this.interviewRepo.create({
      user: { id: dto.user_id } as User,
      job: { job_id: dto.job_id } as Job,
      round_no: dto.round_no,
      date: dto.date,
      time: dto.time,
      status: dto.status,
    });

    const savedInterview = await this.interviewRepo.save(interview);

    
    await this.mailService.sendInterviewAssignedNotification(
      user.email,
      dto.job_id,
      dto.date,
      dto.time,
      dto.round_no,
    );

    return savedInterview;
  }


  findAll(): Promise<Interview[]> {
    return this.interviewRepo.find({
      relations: ['job', 'user'],
    });
  }

  async findByJob(job_id: number): Promise<Interview[]> {
    return this.interviewRepo.find({
      where: { job: { job_id: job_id } },
      relations: ['job', 'user'],
    });
  }

  async findByUser(user_id: number): Promise<Interview[]> {
    return this.interviewRepo.find({
      where: { user: { id: user_id } },
      relations: ['job', 'user'],
    });
  }

  async update(id: number, dto: UpdateInterviewDto): Promise<Interview> {
    const interview = await this.interviewRepo.findOne({ where: { id } });
    if (!interview) throw new NotFoundException('Interview not found');

    Object.assign(interview, dto);
    return this.interviewRepo.save(interview);
  }

  async remove(id: number): Promise<void> {
    const result = await this.interviewRepo.delete(id);
    if (!result.affected) {
      throw new NotFoundException('Interview not found');
    }
  }
  
}