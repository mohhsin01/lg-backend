import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Interview } from './interviews.entity';
import { CreateInterviewDto } from './dto/interviews.dto';
import { UpdateInterviewDto } from './dto/update-interview.dto';
import { User } from '../users/users.entity';
import { Job } from '../jobs/jobs.entity';

@Injectable()
export class InterviewsService {
  constructor(
    @InjectRepository(Interview)
    private readonly interviewRepo: Repository<Interview>,

    
  ) {}

  // ✅ Clean create method - validation is handled by guard
  async create(dto: CreateInterviewDto): Promise<Interview> {
    // Since guard has already validated existence, we can directly fetch

   const interview = this.interviewRepo.create({
      user: { id: dto.user_id } as User,
      job: { job_id: dto.job_id } as Job,
      round_no: dto.round_no,
      date: dto.date,
      time: dto.time,
      status: dto.status,
    });

    return this.interviewRepo.save(interview);
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