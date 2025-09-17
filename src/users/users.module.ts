import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users.entity';
import { MailsModule } from 'src/mails/mails.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), MailsModule], // ✅ include MailsModule here
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
