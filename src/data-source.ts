import { DataSource } from 'typeorm';
import { User } from './users/users.entity';


export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: '123454321',
  database: 'lead_generation',
  entities: [User],
  migrations: ['./migrations/*{.ts,.js}'],
  synchronize: false,
});
