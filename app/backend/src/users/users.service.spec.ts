/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService, roundsOfHashing } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

describe('UsersService', () => {
  let service: UsersService;
  let prisma: PrismaService;

  const mockPrisma = {
    user: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should hash the password and create user', async () => {
      const dto = { email: 'test@example.com', password: '123456' };
      const hashed = await bcrypt.hash(dto.password, roundsOfHashing);

      mockPrisma.user.create.mockResolvedValue({
        id: 1,
        email: dto.email,
        password: hashed,
      });

      const result = await service.create({
        ...dto,
        username: '',
      });

      expect(bcrypt.compareSync(dto.password, result.password)).toBe(true);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          email: dto.email,
          password: expect.any(String),
        }),
      });
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const users = [
        { id: 1, email: 'a' },
        { id: 2, email: 'b' },
      ];
      mockPrisma.user.findMany.mockResolvedValue(users);

      const result = await service.findAll();
      expect(result).toEqual(users);
      expect(prisma.user.findMany).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return one user by id', async () => {
      const user = { id: 1, email: 'a' };
      mockPrisma.user.findUnique.mockResolvedValue(user);

      const result = await service.findOne(1);
      expect(result).toEqual(user);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });

  describe('update', () => {
    it('should update user with hashed password', async () => {
      const dto = { password: 'newpass' };
      const hashed = await bcrypt.hash(dto.password, roundsOfHashing);

      mockPrisma.user.update.mockResolvedValue({
        id: 1,
        email: 'a',
        password: hashed,
      });

      const result = await service.update(1, dto);

      expect(bcrypt.compareSync('newpass', result.password)).toBe(true);
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: expect.objectContaining({ password: expect.any(String) }),
      });
    });

    it('should update user without password', async () => {
      const dto = { email: 'updated@example.com' };

      mockPrisma.user.update.mockResolvedValue({
        id: 1,
        email: dto.email,
        password: 'existing',
      });

      const result = await service.update(1, dto);
      expect(result.email).toBe(dto.email);
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: dto,
      });
    });
  });

  describe('remove', () => {
    it('should delete user', async () => {
      const user = { id: 1, email: 'test@example.com' };
      mockPrisma.user.delete.mockResolvedValue(user);

      const result = await service.remove(1);
      expect(result).toEqual(user);
      expect(prisma.user.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });
});
