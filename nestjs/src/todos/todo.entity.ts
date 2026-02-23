import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { User } from '../users/user.entity';

export enum TodoStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in-progress',
  COMPLETED = 'completed',
}

@Entity('todos')
export class Todo {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'Buy groceries' })
  @Column()
  title: string;

  @ApiProperty({ enum: TodoStatus, default: TodoStatus.PENDING })
  @Column({
    type: 'enum',
    enum: TodoStatus,
    default: TodoStatus.PENDING,
  })
  status: TodoStatus;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @Column()
  @Index()
  userId: string;

  @Exclude()
  @ManyToOne(() => User, (user) => user.todos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}
