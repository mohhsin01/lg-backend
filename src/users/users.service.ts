import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { ConflictException, InternalServerErrorException } from '@nestjs/common';


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  
  ) {}

async create(userData: Partial<User>): Promise<User> {
  const user = this.usersRepository.create({ ...userData });

  try {
    return await this.usersRepository.save(user);
  } catch (error) {
    if (error.code === '23505') {  
      throw new ConflictException('Email is already registered!');
    }
    throw new InternalServerErrorException('Unexpected error while creating user');
  }
}
  async findAll(): Promise<User[]> {
    return this.usersRepository.find({ relations: ['posts'] });
  }

  

async findOne(id: number): Promise<User | null> {
  return this.usersRepository.findOne({
    where: { id },
  // relations: ['posts'], (this is used for the users posts also)
  });
}

  
  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
