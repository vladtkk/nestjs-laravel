import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('in_app_notifications')
export class InAppNotification {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @Column()
  @Index()
  userId!: string;

  @ApiProperty({ example: 'New Task Assigned: Review PR #42' })
  @Column()
  message!: string;

  @ApiProperty({ example: false })
  @Column({ default: false })
  isRead!: boolean;

  @ApiProperty()
  @CreateDateColumn()
  createdAt!: Date;
}
