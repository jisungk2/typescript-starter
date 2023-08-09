import {TaskStatus} from '../entities/task.entity';
import { IsString } from "class-validator";

export class CreateTaskDto {
    @IsString()
    title: string;
    description?: string;
    status: TaskStatus;
}
