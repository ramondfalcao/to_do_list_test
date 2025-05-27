import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async create(createTaskDto: CreateTaskDto) {
    return this.prisma.tasks.create({
      data: createTaskDto,
    });
  }

  async findAll(userId: number) {
    return this.prisma.tasks.findMany({
      where: { id_user: userId },
    });
  }

  async findOne(id: number, userId: number) {
    const task = await this.prisma.tasks.findUnique({
      where: { id },
    });

    if (!task || task.id_user !== userId) {
      throw new ForbiddenException('Negative access to this task');
    }

    return task;
  }

  async update(id: number, updateTaskDto: UpdateTaskDto, userId: number) {
    await this.findOne(id, userId);

    return this.prisma.tasks.update({
      where: { id },
      data: updateTaskDto,
    });
  }

  async remove(id: number, userId: number) {
    await this.findOne(id, userId);

    return this.prisma.tasks.delete({
      where: { id },
    });
  }
}
