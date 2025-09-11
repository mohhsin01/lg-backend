import {
  Controller, Get, Post, Body, Patch, Param, Delete, UseGuards,UseInterceptors
} from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-jobs.dto';
import { UpdateJobDto } from './dto/update-jobs.dto';
import { RolesGuard } from 'src/guards/admin.guard';
import { Roles } from 'src/decorators/roles.decorators';
import { JobInterceptor } from 'src/interceptor/job.interceptor';
import {   ApiTags, ApiOperation, ApiCreatedResponse, ApiOkResponse,ApiParam,ApiBody,ApiBadRequestResponse,ApiHeader} from '@nestjs/swagger';


@ApiTags('Jobs')
@UseInterceptors(JobInterceptor) 
@UseGuards(RolesGuard)
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  @Roles('BD')
  @ApiOperation({ summary: 'Create a new job (BD role required)' })
  @ApiHeader({ 
    name: 'role', 
    description: 'User role must be(BD)', 
    required: true,
    example: 'BD'
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'number', example: 1, description: 'ID of the BD who is creating the job' },
        title: { type: 'string', example: 'Full Stack Developer' },
        description: { type: 'string', example: 'Looking for a skilled developer...' },
        status: { type: 'string', example: 'open', description: 'Job status (optional)' },
        job_salary: { type: 'number', example: 80000, description: 'Job salary (optional)' },
        location: { type: 'string', example: 'New York, NY' },
        dev_id: { type: 'number', example: 5, description: 'Developer ID (optional)' },
      },
      required: ['userId', 'title', 'description', 'location'],
    },
  })
  @ApiCreatedResponse({ description: 'Job created successfully' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  create(@Body() createJobDto: CreateJobDto) {
    console.log('Creating job with DTO:', createJobDto);
    return this.jobsService.create(createJobDto);
  }

  @Get()
  @Roles('admin')
  @ApiOperation({ summary: 'Get all jobs with user information (Admin only)' })
  @ApiHeader({ 
    name: 'role', 
    description: 'User role should be(admin)', 
    required: true,
    example: 'admin'
  })
  @ApiOkResponse({ description: 'List of jobs returned successfully' })
  findAll() {
    console.log('Getting all jobs');
    return this.jobsService.findAll();
  }

  
  @Get('developer/:devId')
  @ApiOperation({ summary: 'Find jobs assigned to a specific developer (No auth required)' })
  @ApiParam({ name: 'devId', type: Number, description: 'Developer ID' })
  @ApiOkResponse({ description: 'Jobs found for developer' })
  findByDevId(@Param('devId') devId: string) {
    console.log('Getting jobs for developer:', devId);
    return this.jobsService.findByDevId(+devId);
  }

  @Get('user/:userId')
  @Roles('admin', 'BD')
  @ApiOperation({ summary: 'Find all jobs posted by a specific user sample url: http://localhost:3000/jobs/user/1' })
  @ApiHeader({ 
    name: 'role', 
    description: 'User role (admin or BD)', 
    required: true,
    example: 'admin'
  })
  @ApiParam({ name: 'userId', type: Number, description: 'BD ID' })
  @ApiOkResponse({ description: 'Jobs found for user' })
  findByUserId(@Param('userId') userId: string) {
    console.log('Getting jobs for user:', userId);
    return this.jobsService.findByUserId(+userId);
  }


  @Get(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Get job by ID with user information (Admin only)' })
  @ApiHeader({ 
    name: 'role', 
    description: 'User role should be(admin)', 
    required: true,
    example: 'admin'
  })
  @ApiParam({ name: 'id', type: Number, description: 'Job ID' })
  @ApiOkResponse({ description: 'Job returned successfully' })
  findOne(@Param('id') id: string) {
    console.log('Getting job by ID:', id);
    return this.jobsService.findOne(+id);
  }

  @Patch(':id')
  @Roles('admin', 'BD')
  @ApiOperation({ summary: 'Update job details by ID' })
  @ApiHeader({ 
    name: 'role', 
    description: 'User role (admin or BD)', 
    required: true,
    example: 'admin'
  })
  @ApiParam({ name: 'id', type: Number, description: 'Job ID' })
  update(@Param('id') id: string, @Body() updateJobDto: UpdateJobDto) {
    console.log('Updating job ID:', id);
    return this.jobsService.update(+id, updateJobDto);
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Delete a job (Admin only)' })
  @ApiHeader({ 
    name: 'role', 
    description: 'User role (admin)', 
    required: true,
    example: 'admin'
  })
  @ApiParam({ name: 'id', type: Number, description: 'Job ID' })
  @ApiOkResponse({ description: 'Job deleted successfully' })
  remove(@Param('id') id: string) {
    console.log('Deleting job ID:', id);
    return this.jobsService.remove(+id);
  }
}