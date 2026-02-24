import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('email_notifications')
export class EmailNotification {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @Column()
  @Index()
  userId!: string;

  @ApiProperty({ example: 'New Task Assigned' })
  @Column()
  subject!: string;

  @ApiProperty({ example: 'You have been assigned a new task: Review PR #42' })
  @Column()
  body!: string;

  @ApiProperty()
  @CreateDateColumn()
  createdAt!: Date;
}
