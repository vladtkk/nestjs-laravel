import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(userData: Partial<User>): Promise<User> {
    try {
      const user = this.usersRepository.create(userData);
      return await this.usersRepository.save(user);
    } catch (e) {
      if (e instanceof QueryFailedError && (e as any).code === '23505') {
        throw new ConflictException('Email already exists');
      }
      throw e;
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.usersRepository.findOne({ where: { email } });
  }

  async findByEmailWithPassword(email: string): Promise<User | null> {
    return await this.usersRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password'],
    });
  }
}
