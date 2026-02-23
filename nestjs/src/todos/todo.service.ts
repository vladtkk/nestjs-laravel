import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from './todo.entity';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { ListTodosQueryDto } from './dto/list-todos-query.dto';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private readonly todoRepository: Repository<Todo>,
  ) {}

  async create(createTodoDto: CreateTodoDto, userId: string): Promise<Todo> {
    const todo = this.todoRepository.create({
      ...createTodoDto,
      userId,
    });
    return this.todoRepository.save(todo);
  }

  async findAll(userId: string, query?: ListTodosQueryDto): Promise<{ data: Todo[]; total: number }> {
    const { page = 1, limit = 20, status } = query || {};
    const skip = (page - 1) * limit;

    const [data, total] = await this.todoRepository.findAndCount({
      where: { userId, ...(status ? { status } : {}) },
      order: { createdAt: 'DESC' },
      take: limit,
      skip,
    });

    return { data, total };
  }

  async findOne(id: string, userId: string): Promise<Todo> {
    const todo = await this.todoRepository.findOne({
      where: { id, userId },
    });

    if (!todo) {
      throw new NotFoundException(`Todo with ID "${id}" not found`);
    }

    return todo;
  }

  async update(id: string, updateTodoDto: UpdateTodoDto, userId: string): Promise<Todo> {
    const todo = await this.findOne(id, userId);
    
    Object.assign(todo, updateTodoDto);
    
    return this.todoRepository.save(todo);
  }

  async remove(id: string, userId: string): Promise<void> {
    const todo = await this.findOne(id, userId);
    await this.todoRepository.remove(todo);
  }
}
