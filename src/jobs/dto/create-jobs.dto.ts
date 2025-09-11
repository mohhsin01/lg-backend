import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateJobDto {
  @IsNumber()
  @IsNotEmpty()
  userId: number;  

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsNumber()
  job_salary?: number;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsOptional()
  @IsNumber()
  dev_id?: number;  
}
