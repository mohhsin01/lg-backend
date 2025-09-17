import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from './jobs.entity';
import { User } from 'src/users/users.entity';
import { MailsModule } from 'src/mails/mails.module';

@Module({
    imports: [TypeOrmModule.forFeature([Job,User]),MailsModule],
  providers: [JobsService],
  controllers: [JobsController]
})

export class JobsModule {}
