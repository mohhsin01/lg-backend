import {
  Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-jobs.dto';
import { UpdateJobDto } from './dto/update-jobs.dto';
import { RolesGuard } from 'src/guards/admin.guard';
import { JobUpdateGuard } from 'src/guards/Authority.guard';
import { Roles } from 'src/decorators/roles.decorators';
import { JobInterceptor } from 'src/interceptor/job.interceptor';
import { CreateJobApi,GetAllJobsApi,GetJobsByDeveloperApi,GetJobsByUserApi,GetJobByIdApi,UpdateJobApi,DeleteJobApi} from '../decorators/jobApi.decorators';

@ApiTags('Jobs')
@UseInterceptors(JobInterceptor) 
@UseGuards(RolesGuard)
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  @Roles('BD')
  @CreateJobApi()
  create(@Body() createJobDto: CreateJobDto) {
    console.log('Creating job with DTO:', createJobDto);
    return this.jobsService.create(createJobDto);
  }

  @Get()
  @Roles('admin')
  @GetAllJobsApi()
  findAll() {
    console.log('Getting all jobs');
    return this.jobsService.findAll();
  }

  @Get('developer/:devId')
  @GetJobsByDeveloperApi()
  findByDevId(@Param('devId') devId: string) {
    console.log('Getting jobs for developer:', devId);
    return this.jobsService.findByDevId(+devId);
  }

  @Get('user/:userId')
  @GetJobsByUserApi()
  findByUserId(@Param('userId') userId: string) {
    console.log('Getting jobs for user:', userId);
    return this.jobsService.findByUserId(+userId);
}
  @Get(':id')
  @Roles('admin')
  @GetJobByIdApi()
  findOne(@Param('id') id: string) {
    console.log('Getting job by ID:', id);
    return this.jobsService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JobUpdateGuard)
  @UpdateJobApi()
  update(@Param('id') id: string, @Body() updateJobDto: UpdateJobDto) {
    console.log('Updating job ID:', id);
    return this.jobsService.update(+id, updateJobDto);
  }

  @Delete(':id')
  @Roles('admin')
  @DeleteJobApi()
  remove(@Param('id') id: string) {
    console.log('Deleting job ID:', id);
    return this.jobsService.remove(+id);
  }
  
}