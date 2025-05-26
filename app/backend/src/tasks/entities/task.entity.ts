import { ApiProperty } from '@nestjs/swagger';
import { Tasks } from 'generated/prisma';

export class TaskEntity implements Tasks {
  constructor(partial: Partial<TaskEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  id: number;

  @ApiProperty()
  id_user: number;

  @ApiProperty()
  description: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updateAt: Date;
}
