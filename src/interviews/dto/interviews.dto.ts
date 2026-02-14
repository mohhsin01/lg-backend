import { IsNumber, IsString, IsDateString, IsOptional } from 'class-validator';

export class CreateInterviewDto {
  @IsNumber()
  job_id: number;

  @IsNumber()
  user_id: number;

  @IsNumber()
  round_no: number;

  @IsDateString()
  date: string;

  @IsString()
  time: string;

  @IsOptional()
  @IsString()
  status?: string;
}
