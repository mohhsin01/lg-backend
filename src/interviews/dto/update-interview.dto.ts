import { PartialType } from '@nestjs/mapped-types';
import { CreateInterviewDto } from './interviews.dto';

export class UpdateInterviewDto extends PartialType(CreateInterviewDto) {}
