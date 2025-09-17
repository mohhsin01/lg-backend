import { Module } from '@nestjs/common';
import { InterviewsService } from './interviews.service';
import { InterviewsController } from './interviews.controller';
import { User } from '../users/users.entity';
import { Job} from '../jobs/jobs.entity';
import { Interview } from './interviews.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InterviewValidationGuard } from '../guards/interviewValidation.guard';
import { MailsModule } from 'src/mails/mails.module';
@Module({
    imports: [TypeOrmModule.forFeature([Job,User,Interview]),MailsModule],
  providers: [InterviewsService,InterviewValidationGuard],
  controllers: [InterviewsController]
})

export class InterviewsModule {}
