import { Todo } from '../todo.entity';

export class TodoCreatedEvent {
  static readonly EVENT_NAME = 'todo.created';

  constructor(
    public readonly todo: Todo,
    public readonly userId: string,
  ) {}
}
