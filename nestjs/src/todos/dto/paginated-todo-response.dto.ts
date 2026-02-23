import { ApiProperty } from '@nestjs/swagger';
import { TodoResponseDto } from './todo-response.dto';

export class PaginatedTodoResponseDto {
  @ApiProperty({ type: [TodoResponseDto] })
  data: TodoResponseDto[];

  @ApiProperty({ example: 100 })
  total: number;
}
