import { ApiProperty } from '@nestjs/swagger';
import { TodoStatus } from '../todo.entity';

export class TodoResponseDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id!: string;

  @ApiProperty({ example: 'Buy groceries' })
  title!: string;

  @ApiProperty({ enum: TodoStatus, example: TodoStatus.PENDING })
  status!: TodoStatus;

  @ApiProperty({ example: '2026-02-23T18:53:00.000Z' })
  createdAt!: Date;

  @ApiProperty({ example: '2026-02-23T18:53:00.000Z' })
  updatedAt!: Date;
}
