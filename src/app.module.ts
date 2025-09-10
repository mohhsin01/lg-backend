import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm'; 

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '123454321',
      database: 'lead_generation',
      autoLoadEntities: true,
      synchronize: false,
      migrationsRun: true,
      migrations: [__dirname + '/migrations/*{.ts,.js}'],
    }),
    UsersModule,
    
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

