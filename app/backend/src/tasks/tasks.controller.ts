import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiOkResponse, ApiQuery } from '@nestjs/swagger';
import { TaskEntity } from './entities/task.entity';
import { Request } from 'express';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: TaskEntity })
  create(@Body() createTaskDto: CreateTaskDto, @Req() req: Request) {
    if (!req.user) {
      throw new Error('Unauthenticated user');
    }

    return this.tasksService.create({
      ...createTaskDto,
      id_user: req.user.id,
    });
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: TaskEntity, isArray: true })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (starts from 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page',
  })
  findAll(
    @Req() req: Request,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    if (!req.user) {
      throw new Error('Unauthenticated user');
    }

    return this.tasksService.findAll(req.user.id, page, limit);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: TaskEntity })
  findOne(@Param('id', ParseIntPipe) id: string, @Req() req: Request) {
    if (!req.user) {
      throw new Error('Unauthenticated user');
    }
    return this.tasksService.findOne(+id, req.user.id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: TaskEntity })
  update(
    @Param('id', ParseIntPipe) id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @Req() req: Request,
  ) {
    if (!req.user) {
      throw new Error('Unauthenticated user');
    }
    return this.tasksService.update(+id, updateTaskDto, req.user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: TaskEntity })
  remove(@Param('id', ParseIntPipe) id: string, @Req() req: Request) {
    if (!req.user) {
      throw new Error('Unauthenticated user');
    }
    return this.tasksService.remove(+id, req.user.id);
  }
}
