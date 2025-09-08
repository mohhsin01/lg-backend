import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { ConflictEmailException } from '../Exception/email.exception';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  
  ) {}


async create(userData: Partial<User>): Promise<User> {
  
  const existingUser = await this.usersRepository.findOne({
    where: { email: userData.email },
  });

  if (existingUser) {
    throw new ConflictEmailException(userData.email!);
  }

  
  const user = this.usersRepository.create({ ...userData });
  return await this.usersRepository.save(user);
}
  async findAll(): Promise<User[]> {
    return this.usersRepository.find({ relations: ['posts'] });
  }

  

async findOne(id: number): Promise<User | null> {
  return this.usersRepository.findOne({
    where: { id },
  // relations: ['posts'],
  });
}

  
  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
