import { IsString, IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class NotificationMessageDto {
  @ApiProperty({
    description: 'The subject of the notification',
    example: 'New Task Assigned',
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  subject!: string;

  @ApiProperty({
    description: 'The body content of the notification',
    example: 'You have been assigned a new task: Review PR #42',
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  body!: string;

  @ApiProperty({
    description: 'The UUID of the target user',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  userId!: string;
}
