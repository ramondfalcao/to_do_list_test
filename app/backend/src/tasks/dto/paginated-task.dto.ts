import { ApiProperty } from '@nestjs/swagger';
import { TaskEntity } from '../entities/task.entity';

export class PaginatedTasksDto {
  @ApiProperty({ type: [TaskEntity] })
  data: TaskEntity[];

  @ApiProperty()
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
