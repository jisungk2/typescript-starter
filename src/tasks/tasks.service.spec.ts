import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { mock } from 'node:test';
import {TaskStatus} from './entities/task.entity';

describe('TasksService', () => {
  let service: TasksService;

  const mockTasksService = {
    create: jest
      .fn()
      .mockImplementation((task) => 
      Promise.resolve({ id: Date.now(), createdAt: Date.now(), updatedAt: Date.now(), ...task })
      )
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TasksService],
    })
      .overrideProvider(TasksService)
      .useValue(mockTasksService)
      .compile();

    service = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new task and return it', async () => {
    expect(await service.create({ title: 'task title', description: 'task description', status: TaskStatus.IN_PROGRESS})).toEqual({
      id: expect.any(Number),
      title: 'task title',
      description: 'task description',
      status: 'IN_PROGRESS',
      createdAt: expect.any(Number),
      updatedAt: expect.any(Number),
    })
  })
});
