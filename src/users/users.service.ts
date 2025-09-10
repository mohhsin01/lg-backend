import { Injectable, ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  // Create User
  async create(userData: Partial<User>): Promise<User> {
    const user = this.usersRepository.create(userData);

    try {
      return await this.usersRepository.save(user);
    } catch (error) {
      if (error.code === '23505') { // unique violation
        throw new ConflictException('Email is already registered!');
      }
      throw new InternalServerErrorException('Unexpected error while creating user');
    }
  }

  // Find All Users
  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  // Find One User
  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  // Update User
  async update(id: number, userData: Partial<User>): Promise<User> {
    await this.usersRepository.update(id, userData);
    const updatedUser = await this.usersRepository.findOne({ where: { id } });
    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return updatedUser;
  }

  // Delete User
  async remove(id: number): Promise<void> {
    const result = await this.usersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }
}
