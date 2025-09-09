import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { User } from './user.entity';
import { IsUniqueConstraint } from 'src/decorator/unique.constraint';


@Module({
   imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService, IsUniqueConstraint],
  controllers: [UsersController]
})
export class UsersModule {}
