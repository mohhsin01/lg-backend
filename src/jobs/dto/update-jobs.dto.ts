import { PartialType } from '@nestjs/swagger';
import { CreateJobDto } from './create-jobs.dto';

export class UpdateJobDto extends PartialType(CreateJobDto) {}
