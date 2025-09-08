import { DataSource } from 'typeorm';
import { User } from './users/user.entity';
import { Post } from './posts/post.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: '123454321',
  database: 'Temp',
  entities: [ User,Post],
  migrations: ['src/migrations/*{.ts,.js}'],
  synchronize: false,
});
