import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { Post } from '../posts/post.entity';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { RolesGuard } from '../guards/roles.guards';

describe('UsersController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
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
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: APP_INTERCEPTOR,
      useValue: { intercept: (_context, next) => next.handle() },
       // bypass interceptor because my controller interceptor have the logic to add the data of the users!
    },
  ],
})
  .overrideProvider(RolesGuard) 
  .useValue({
    canActivate: (context) => {
      const req = context.switchToHttp().getRequest();
        req.user = { role: 'admin' };
        return true; // allow all requests
      
    },
  }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/users (POST) → should create a user', async () => {
    const testEmail = `jane_${Date.now()}_${Math.random()}@example.com`;//here i used the random function to avoid the conflict email exception

    const res = await request(app.getHttpServer())
      .post('/users')
      .send({
        name: 'Jane Doe',
        email: testEmail,
        password: '123456',
        role: 'user',
      }) .expect(201);

    expect(res.body).toHaveProperty('id');
    expect(res.body.email).toBe(testEmail);
  });

  it('/users (GET), It have to return all users', async () => {
    const res = await request(app.getHttpServer()).get('/users').expect(200);

    expect(Array.isArray(res.body)).toBe(true);
  });

  it('/users/:id ,It have fetch created user', async () => {
    const testEmail = `john_${Date.now()}_${Math.random()}@example.com`;

    const created = await request(app.getHttpServer())
      .post('/users')
      .send({
        name: 'John Doe',
        email: testEmail,
        password: '123456',
        role: 'user',
      }).expect(201);

    const userId = created.body.id;

    const res = await request(app.getHttpServer()).get(`/users/${userId}`).expect(200);

    expect(res.body.email).toBe(testEmail);
  });

  it('/users/:id (DELETE) It have to forbid deletion for non-admin', async () => {
    const testEmail = `mark_${Date.now()}_${Math.random()}@example.com`;

    const created = await request(app.getHttpServer())
      .post('/users')
      .send({
        name: 'Mark Doe',
        email: testEmail,
        password: '123456',
        role: 'user',
      })
      .expect(201);

    const userId = created.body.id;

    await request(app.getHttpServer())
      .delete(`/users/${userId}`)
      .set('role', 'user') // not admin
      .expect(403);
  });

  it('/users/:id (DELETE) → should allow deletion for admin', async () => {
    const testEmail = `admin_${Date.now()}_${Math.random()}@example.com`;

    const created = await request(app.getHttpServer())
      .post('/users')
      .send({
        name: 'Admin User',
        email: testEmail,
        password: '123456',
        role: 'user',
      }).expect(201);

    const userId = created.body.id;

    await request(app.getHttpServer())
      .delete(`/users/${userId}`)
      .set('role', 'admin') .expect(200);
  });
});
