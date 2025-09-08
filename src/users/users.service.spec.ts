import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { Post } from '../posts/post.entity';
import { ConflictEmailException } from '../Exception/email.exception';
import { DataSource } from 'typeorm';

jest.setTimeout(20000); //(My DB connections was taking a long time so i increse the Jest timeout)

describe('UsersService (integration with Postgres)', () => {
  let service: UsersService;

let dataSource: DataSource;

beforeAll(async () => {
  const module: TestingModule = await Test.createTestingModule({
    imports: [
      TypeOrmModule.forRoot({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: '123454321',
        database: 'Temp2',
        entities: [User, Post],
        synchronize: true,
        dropSchema: true,
      }),
      TypeOrmModule.forFeature([User]),
    ],
    providers: [UsersService],
  }).compile();

  service = module.get<UsersService>(UsersService);
  dataSource = module.get<DataSource>(DataSource); 
});

afterAll(async () => {
  await dataSource.destroy(); 
});
  it('should create a user successfully', async () => {
    const user = await service.create({
      name: 'Test User',
      email: 'test@example.com',
      password: '12345',
      role :'user'
    });

    expect(user).toBeDefined();
    expect(user.email).toBe('test@example.com');
  });

  it('should throw ConflictEmailException if email already exists', async () => {
   
    await service.create({
      name: 'Duplicate User',
      email: 'duplicate@example.com',
      password: '12345',
      role :'user'  
    });

    //i am creating a new user with the same email to check the exception
    await expect(
      service.create({
        name: 'Another User',
        email: 'duplicate@example.com',
        password: '67890',
        role :'user'
      }),
    ).rejects.toThrow(ConflictEmailException);
  });

  it('should find all users', async () => {
    const users = await service.findAll();
    expect(Array.isArray(users)).toBe(true);
  });

  it('should find one user by id', async () => {
    const newUser = await service.create({
      name: 'Find Me',
      email: 'findme@example.com',
      password: 'mypassword',
      role :'user'
    });

    const foundUser = await service.findOne(newUser.id);
    expect(foundUser).toBeDefined();
    expect(foundUser?.email).toBe('findme@example.com');
  });

  it('should remove a user', async () => {
    const newUser = await service.create({
      name: 'Delete Me',
      email: 'delete@example.com',
      password: 'remove',
      role :'user'
    });

    await service.remove(newUser.id);

    const deletedUser = await service.findOne(newUser.id);
    expect(deletedUser).toBeNull();
  });
});
