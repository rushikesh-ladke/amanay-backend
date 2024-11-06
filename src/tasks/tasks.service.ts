import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task, TaskStatus } from './entities/task.entity';
import { CreateTaskDto, UpdateTaskDto, CompleteTaskDto } from './dto/task.dto';
import { User } from '../user/user.entity';
import { NotesService } from '../notes/notes.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    private notesService: NotesService,
  ) {}

  async create(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    // Verify note exists and user has access
    const note = await this.notesService.findOne(createTaskDto.noteId, user);

    const task = this.taskRepository.create({
      ...createTaskDto,
      note,
      reporter: user,
      createdBy: user,
      updatedBy: user,
      assignee: createTaskDto.assigneeId ? { id: createTaskDto.assigneeId } as User : user,
    });

    return this.taskRepository.save(task);
  }

  async findAll(user: User): Promise<Task[]> {
    return this.taskRepository.find({
      where: [
        { assignee: { id: user.id }, isActive: true },
        { reporter: { id: user.id }, isActive: true }
      ],
      relations: ['assignee', 'reporter', 'note', 'sops'],
      order: { createdAt: 'DESC' }
    });
  }

  async findOne(id: string, user: User): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { 
        id,
        isActive: true
      },
      relations: ['assignee', 'reporter', 'note', 'sops', 'questions']
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    // Check if user has access
    if (task.assignee.id !== user.id && task.reporter.id !== user.id) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto, user: User): Promise<Task> {
    const task = await this.findOne(id, user);
    
    if (updateTaskDto.noteId) {
      // Verify new note exists and user has access
      await this.notesService.findOne(updateTaskDto.noteId, user);
    }

    const updatedTask = this.taskRepository.merge(task, {
      ...updateTaskDto,
      updatedBy: user,
      note: updateTaskDto.noteId ? { id: updateTaskDto.noteId } : task.note,
      assignee: updateTaskDto.assigneeId ? { id: updateTaskDto.assigneeId } as User : task.assignee
    });

    return this.taskRepository.save(updatedTask);
  }

  async complete(id: string, completeTaskDto: CompleteTaskDto, user: User): Promise<Task> {
    const task = await this.findOne(id, user);

    if (task.status === TaskStatus.DONE) {
      throw new BadRequestException('Task is already completed');
    }

    const completedTask = this.taskRepository.merge(task, {
      ...completeTaskDto,
      status: TaskStatus.DONE,
      completedBy: user,
      completedOn: new Date(),
      updatedBy: user
    });

    return this.taskRepository.save(completedTask);
  }

  async remove(id: string, user: User): Promise<void> {
    const task = await this.findOne(id, user);
    await this.taskRepository.save({
      ...task,
      isActive: false,
      updatedBy: user
    });
  }
}
