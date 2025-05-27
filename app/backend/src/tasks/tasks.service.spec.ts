import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { PrismaService } from '../prisma/prisma.service';
import { ForbiddenException } from '@nestjs/common';

const mockPrisma = {
  tasks: {
    create: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('TasksService', () => {
  let service: TasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    jest.clearAllMocks();
  });

  it('should create a task', async () => {
    const dto = {
      title: 'Task',
      description: 'Test',
      id_user: 1,
      checked: false,
    };
    mockPrisma.tasks.create.mockResolvedValue(dto);
    const result = await service.create(dto);
    expect(result).toEqual(dto);
    expect(mockPrisma.tasks.create).toHaveBeenCalledWith({ data: dto });
  });

  it('should return paginated tasks', async () => {
    const userId = 1;
    const page = 1;
    const limit = 10;
    const tasks = [{ id: 1, title: 'Task', id_user: userId }];
    mockPrisma.tasks.findMany.mockResolvedValue(tasks);
    mockPrisma.tasks.count.mockResolvedValue(1);

    const result = await service.findAll(userId, page, limit);
    expect(result.data).toEqual(tasks);
    expect(result.meta.total).toBe(1);
    expect(result.meta.totalPages).toBe(1);
  });

  it('should return a task if user owns it', async () => {
    const task = { id: 1, id_user: 1 };
    mockPrisma.tasks.findUnique.mockResolvedValue(task);
    const result = await service.findOne(1, 1);
    expect(result).toEqual(task);
  });

  it('should throw ForbiddenException if user does not own the task', async () => {
    const task = { id: 1, id_user: 2 };
    mockPrisma.tasks.findUnique.mockResolvedValue(task);
    await expect(service.findOne(1, 1)).rejects.toThrow(ForbiddenException);
  });

  it('should update a task', async () => {
    const task = { id: 1, id_user: 1 };
    const updateDto = { title: 'Updated' };
    mockPrisma.tasks.findUnique.mockResolvedValue(task);
    mockPrisma.tasks.update.mockResolvedValue({ ...task, ...updateDto });

    const result = await service.update(1, updateDto, 1);
    expect(result.title).toBe('Updated');
  });

  it('should delete a task', async () => {
    const task = { id: 1, id_user: 1 };
    mockPrisma.tasks.findUnique.mockResolvedValue(task);
    mockPrisma.tasks.delete.mockResolvedValue(task);

    const result = await service.remove(1, 1);
    expect(result).toEqual(task);
  });
});
