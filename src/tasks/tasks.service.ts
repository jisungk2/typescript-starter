import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { InjectRepository } from '@nestjs/typeorm';


@Injectable()
export class TasksService {
  constructor(@InjectRepository(Task) private readonly taskRepository: Repository<Task>) {}

  async create(createTaskDto: CreateTaskDto) {
    const task = this.taskRepository.create(createTaskDto);
    return await this.taskRepository.save(task);
  }

  async findOne(id: number) {
    return this.taskRepository.findOne({ where: {id} });
  }

  async remove(id: number) {
    const task = await this.taskRepository.findOne({ where: { id} });
    return await this.taskRepository.remove(task);
  }
}
