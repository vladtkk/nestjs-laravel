import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { ListTodosQueryDto } from './dto/list-todos-query.dto';
import { TodoResponseDto } from './dto/todo-response.dto';
import { PaginatedTodoResponseDto } from './dto/paginated-todo-response.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('todos')
@ApiBearerAuth()
@Controller('todos')
@UseGuards(JwtAuthGuard)
export class TodoController {
  constructor(private readonly todosService: TodoService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new TODO item' })
  @ApiResponse({ status: 201, description: 'The TODO has been successfully created.', type: TodoResponseDto })
  create(@Body() createTodoDto: CreateTodoDto, @CurrentUser('id') userId: string): Promise<TodoResponseDto> {
    return this.todosService.create(createTodoDto, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all TODO items for the current user' })
  @ApiResponse({ status: 200, description: 'Return paginated TODOs.', type: PaginatedTodoResponseDto })
  findAll(
    @CurrentUser('id') userId: string,
    @Query() query: ListTodosQueryDto,
  ): Promise<PaginatedTodoResponseDto> {
    return this.todosService.findAll(userId, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific TODO item by ID' })
  @ApiResponse({ status: 200, description: 'Return the TODO item.', type: TodoResponseDto })
  @ApiResponse({ status: 404, description: 'TODO not found.' })
  findOne(@Param('id', ParseUUIDPipe) id: string, @CurrentUser('id') userId: string): Promise<TodoResponseDto> {
    return this.todosService.findOne(id, userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a TODO item' })
  @ApiResponse({ status: 200, description: 'The TODO has been successfully updated.', type: TodoResponseDto })
  @ApiResponse({ status: 404, description: 'TODO not found.' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTodoDto: UpdateTodoDto,
    @CurrentUser('id') userId: string,
  ): Promise<TodoResponseDto> {
    return this.todosService.update(id, updateTodoDto, userId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a TODO item' })
  @ApiResponse({ status: 204, description: 'The TODO has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'TODO not found.' })
  remove(@Param('id', ParseUUIDPipe) id: string, @CurrentUser('id') userId: string): Promise<void> {
    return this.todosService.remove(id, userId);
  }
}
