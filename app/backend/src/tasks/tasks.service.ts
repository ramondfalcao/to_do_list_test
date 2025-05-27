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

  async findAll(userId: number, page: number, limit: number) {
    page = Math.max(1, Number(page) || 1);
    limit = Math.max(1, Number(limit) || 10);

    const skip = (page - 1) * limit;
    const [tasks, total] = await Promise.all([
      this.prisma.tasks.findMany({
        where: { id_user: userId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.tasks.count({
        where: { id_user: userId },
      }),
    ]);

    return {
      data: tasks,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
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
