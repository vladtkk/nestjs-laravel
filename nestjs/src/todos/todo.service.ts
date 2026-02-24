import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Transactional, runOnTransactionCommit } from 'typeorm-transactional';
import { Todo } from './todo.entity';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { ListTodosQueryDto } from './dto/list-todos-query.dto';
import { PageMetaDto } from '../common/dto/page-meta.dto';
import { TodoCreatedEvent } from './events/todo-created.event';

@Injectable()
export class TodoService {
  private readonly logger = new Logger(TodoService.name);

  constructor(
    @InjectRepository(Todo)
    private readonly todoRepository: Repository<Todo>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Transactional()
  async create(createTodoDto: CreateTodoDto, userId: string): Promise<Todo> {
    const todo = this.todoRepository.create({
      ...createTodoDto,
      userId,
    });
    const savedTodo = await this.todoRepository.save(todo);

    runOnTransactionCommit(() => {
      this.eventEmitter.emit(
        TodoCreatedEvent.EVENT_NAME,
        new TodoCreatedEvent(savedTodo, userId),
      );
    });

    return savedTodo;
  }

  async findAll(userId: string, query?: ListTodosQueryDto): Promise<{ data: Todo[]; meta: PageMetaDto }> {
    const { page = 1, limit = 20, status } = query || {};
    const skip = (page - 1) * limit;

    const [data, total] = await this.todoRepository.findAndCount({
      where: { userId, ...(status ? { status } : {}) },
      order: { createdAt: 'DESC' },
      take: limit,
      skip,
    });

    const meta = new PageMetaDto({ itemCount: total, pageOptionsDto: { page, limit } });

    return { data, meta };
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

    this.todoRepository.merge(todo, updateTodoDto);

    return this.todoRepository.save(todo);
  }

  async remove(id: string, userId: string): Promise<void> {
    const todo = await this.findOne(id, userId);
    await this.todoRepository.remove(todo);
  }
}
