import { ApiProperty } from '@nestjs/swagger';
import { TodoResponseDto } from './todo-response.dto';
import { PageMetaDto } from '../../common/dto/page-meta.dto';

export class PaginatedTodoResponseDto {
  @ApiProperty({ type: [TodoResponseDto] })
  readonly data!: TodoResponseDto[];

  @ApiProperty({ type: () => PageMetaDto })
  readonly meta!: PageMetaDto;
}
