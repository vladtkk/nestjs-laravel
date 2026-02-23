import { IsString, IsNotEmpty, IsEnum, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { TodoStatus } from '../todo.entity';

export class CreateTodoDto {
  @ApiProperty({
    description: 'The title of the TODO item',
    example: 'Buy groceries',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @Transform(({ value }) => value?.trim())
  title: string;

  @ApiPropertyOptional({
    description: 'The status of the TODO item',
    enum: TodoStatus,
    default: TodoStatus.PENDING,
  })
  @IsEnum(TodoStatus)
  @IsOptional()
  status?: TodoStatus;
}
