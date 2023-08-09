import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TasksModule } from '../src/tasks/tasks.module';
import { Task, TaskStatus } from '../src/tasks/entities/task.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('TaskController (e2e)', () => {
  let app: INestApplication;

  const mockTask = [{ id: 1, title: 'task title', description: 'task description' }];

  const mockTasksRepository = {
    findOne: jest.fn().mockResolvedValue(mockTask),
    create: jest.fn().mockImplementation((createTaskDto) => createTaskDto),
    save: jest
      .fn()
      .mockImplementation((task) => 
      Promise.resolve({ id: Date.now(), createdAt: Date.now(), updatedAt: Date.now(), ...task })
      )
  }

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [TasksModule],
    }).overrideProvider(getRepositoryToken(Task)).useValue(mockTasksRepository).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/tasks/1 (GET)', () => {
    return request(app.getHttpServer())
      .get('/tasks/1')
      .expect('Content-Type', /json/)
      .expect(200)
  });

  it('/tasks (POST)', () => {
    return request(app.getHttpServer())
    .post('/tasks')
    .send({ title: 'task title', description: 'task description', status: TaskStatus.TODO })
    .expect('Content-Type', /json/)
    .expect(201)
    .then((response) => {
        expect(response.body).toEqual({
            id: expect.any(Number),
            title: 'task title',
            description: 'task description',
            status: 'TODO',
            createdAt: expect.any(Number),
            updatedAt: expect.any(Number)
        })
    })
  })

  it('/tasks (POST) --> 400 on validation error', () => {
    return request(app.getHttpServer())
    .post('/tasks')
    .send({ description: 'task description', status: TaskStatus.TODO })
    .expect('Content-Type', /json/)
    .expect(400)
  })
});
