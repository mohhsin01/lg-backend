import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from './jobs.entity';
import { User } from 'src/users/users.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Job,User])],
  providers: [JobsService],
  controllers: [JobsController]
})
export class JobsModule {}
