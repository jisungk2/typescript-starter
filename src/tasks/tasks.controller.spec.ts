import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import {TaskStatus} from './entities/task.entity';

describe('TasksController', () => {
  let controller: TasksController;

  const mockTasksService = {
    create: jest.fn(createTaskDto => {
      return {
        id: Date.now(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
        ...createTaskDto
      }
    })
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [TasksService],
    })
      .overrideProvider(TasksService)
      .useValue(mockTasksService)
      .compile();

    controller = module.get<TasksController>(TasksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a task', () => {
    expect(controller.create({ title: "task title", description: "task description", status: TaskStatus.TODO })).toEqual({
      id: expect.any(Number),
      title: "task title",
      description: "task description",
      status: "TODO",
      createdAt: expect.any(Number),
      updatedAt: expect.any(Number)
    })
  })

  it('should create a task', () => {
    expect(controller.create({ title: "task title", status: TaskStatus.TODO })).toEqual({
      id: expect.any(Number),
      title: "task title",
      status: "TODO",
      createdAt: expect.any(Number),
      updatedAt: expect.any(Number)
    })
  })

});
