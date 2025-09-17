import { Controller, Post, Body, Get, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { InterviewsService } from './interviews.service';
import { CreateInterviewDto } from './dto/interviews.dto';
import { UpdateInterviewDto } from './dto/update-interview.dto';
import { InterviewValidationGuard } from 'src/guards/interviewValidation.guard';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from '../decorators/roles.decorators';
import { interviewViewGuard, InterviewAssignGuard } from 'src/guards/Authority.guard';
import {  CreateInterviewApi,GetAllInterviewsApi, GetInterviewsByJobApi, 
GetInterviewsByUserApi, UpdateInterviewApi, DeleteInterviewApi } from '../decorators/interviewApi.decorators';


@ApiTags('Interviews')
// Using guards to check if job or user ID exists in specific tables
// TypeORM doesn't validate foreign keys by default before create, only on save
@UseGuards(InterviewValidationGuard)
@Roles('admin')
@Controller('interviews')
export class InterviewsController {
  constructor(private readonly interviewsService: InterviewsService) {}
@UseGuards(InterviewAssignGuard)//interview have to be assingned only to the developers.
  @Post()
  @CreateInterviewApi()
  create(@Body() dto: CreateInterviewDto) {
    return this.interviewsService.create(dto);
  }

  @Roles('admin')
  @Get()
  @GetAllInterviewsApi()
  findAll() {
    return this.interviewsService.findAll();
  }

  @Roles('admin')
  @Get('job/:job_id')
  @GetInterviewsByJobApi()
  findByJob(@Param('job_id') job_id: string) {
    return this.interviewsService.findByJob(+job_id);
  }

  // Admin and developer (only their own) can view interviews
  @Roles('admin', 'developer')
  @UseGuards(interviewViewGuard)
  @Get('user/:user_id')
  @GetInterviewsByUserApi()
  findByUser(@Param('user_id') user_id: string) {
    return this.interviewsService.findByUser(+user_id);
  }

  @Roles('admin')
  @Patch(':id')
  @UpdateInterviewApi()
  update(@Param('id') id: string, @Body() dto: UpdateInterviewDto) {
    return this.interviewsService.update(+id, dto);
  }

  @Roles('admin')
  @Delete(':id')
  @DeleteInterviewApi()
  remove(@Param('id') id: string) {
    return this.interviewsService.remove(+id);
  }
  
}