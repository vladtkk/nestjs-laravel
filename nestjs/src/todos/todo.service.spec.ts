import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TodoService } from './todo.service';
import { Todo, TodoStatus } from './todo.entity';
import { NotFoundException } from '@nestjs/common';
import { PageMetaDto } from '../common/dto/page-meta.dto';

describe('TodoService', () => {
  let service: TodoService;
  let repository: Repository<Todo>;

  const mockTodo: Partial<Todo> = {
    id: 'uuid',
    title: 'Test Todo',
    status: TodoStatus.PENDING,
    userId: 'user-uuid',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockTodoRepository = {
    create: jest.fn().mockReturnValue(mockTodo as Todo),
    save: jest.fn().mockResolvedValue(mockTodo as Todo),
    find: jest.fn().mockResolvedValue([mockTodo as Todo]),
    findAndCount: jest.fn().mockResolvedValue([[mockTodo as Todo], 1]),
    findOne: jest.fn().mockResolvedValue(mockTodo as Todo),
    remove: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoService,
        {
          provide: getRepositoryToken(Todo),
          useValue: mockTodoRepository,
        },
      ],
    }).compile();

    service = module.get<TodoService>(TodoService);
    repository = module.get<Repository<Todo>>(getRepositoryToken(Todo));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new todo', async () => {
      const createTodoDto = { title: 'Test Todo' };
      const userId = 'user-uuid';
      
      const result = await service.create(createTodoDto, userId);
      
      expect(repository.create).toHaveBeenCalledWith({
        ...createTodoDto,
        userId,
      });
      expect(repository.save).toHaveBeenCalled();
      expect(result).toEqual(mockTodo);
    });
  });

  describe('findAll', () => {
    it('should return a paginated result of todos', async () => {
      const userId = 'user-uuid';
      const query = { page: 1, limit: 10 };
      
      mockTodoRepository.findAndCount = jest.fn().mockResolvedValue([[mockTodo as Todo], 1]);
      
      const result = await service.findAll(userId, query);
      
      expect(mockTodoRepository.findAndCount).toHaveBeenCalledWith({
        where: { userId },
        order: { createdAt: 'DESC' },
        take: 10,
        skip: 0,
      });
      const expectedMeta = new PageMetaDto({ itemCount: 1, pageOptionsDto: { page: 1, limit: 10 } });
      expect(result).toEqual({ data: [mockTodo], meta: expectedMeta });
    });
  });

  describe('findOne', () => {
    it('should return a single todo', async () => {
      const id = 'uuid';
      const userId = 'user-uuid';
      const result = await service.findOne(id, userId);
      
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id, userId },
      });
      expect(result).toEqual(mockTodo);
    });

    it('should throw NotFoundException if todo not found', async () => {
      mockTodoRepository.findOne.mockResolvedValueOnce(null);
      const id = 'uuid';
      const userId = 'user-uuid';
      
      await expect(service.findOne(id, userId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a todo', async () => {
      const id = 'uuid';
      const userId = 'user-uuid';
      const updateTodoDto = { title: 'Updated Title' };
      
      const result = await service.update(id, updateTodoDto, userId);
      
      expect(repository.save).toHaveBeenCalled();
      expect(result.title).toEqual('Updated Title');
    });

    it('should throw NotFoundException if todo to update not found', async () => {
      mockTodoRepository.findOne.mockResolvedValueOnce(null);
      const id = 'non-existent';
      const userId = 'user-uuid';
      const updateTodoDto = { title: 'Updated Title' };
      
      await expect(service.update(id, updateTodoDto, userId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a todo', async () => {
      const id = 'uuid';
      const userId = 'user-uuid';
      
      await service.remove(id, userId);
      
      expect(repository.remove).toHaveBeenCalled();
    });

    it('should throw NotFoundException if todo to remove not found', async () => {
      mockTodoRepository.findOne.mockResolvedValueOnce(null);
      const id = 'non-existent';
      const userId = 'user-uuid';
      
      await expect(service.remove(id, userId)).rejects.toThrow(NotFoundException);
    });
  });
});
