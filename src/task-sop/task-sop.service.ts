import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskSOP } from './entities/task-sop.entity';
import { CreateTaskSOPDto, UpdateTaskSOPDto, CompleteTaskSOPDto, ReorderTaskSOPDto } from './dto/task-sop.dto';
import { User } from '../user/user.entity';
import { TasksService } from '../tasks/tasks.service';

@Injectable()
export class TaskSOPService {
  constructor(
    @InjectRepository(TaskSOP)
    private taskSOPRepository: Repository<TaskSOP>,
    private tasksService: TasksService,
  ) {}

  async create(
    taskId: string,
    createTaskSOPDto: CreateTaskSOPDto,
    user: User
  ): Promise<TaskSOP> {
    // Verify task exists and user has access
    const task = await this.tasksService.findOne(taskId, user);

    // Check if step number already exists
    const existingStep = await this.taskSOPRepository.findOne({
      where: {
        task: { id: taskId },
        stepNumber: createTaskSOPDto.stepNumber,
        isActive: true
      }
    });

    if (existingStep) {
      throw new BadRequestException(`Step number ${createTaskSOPDto.stepNumber} already exists`);
    }

    const taskSOP = this.taskSOPRepository.create({
      ...createTaskSOPDto,
      task: { id: taskId },
      createdBy: user,
      updatedBy: user
    });

    return this.taskSOPRepository.save(taskSOP);
  }

  async findAll(taskId: string, user: User): Promise<TaskSOP[]> {
    // Verify task exists and user has access
    await this.tasksService.findOne(taskId, user);

    return this.taskSOPRepository.find({
      where: {
        task: { id: taskId },
        isActive: true
      },
      relations: ['createdBy', 'updatedBy', 'completedBy'],
      order: { stepNumber: 'ASC' }
    });
  }

  async findOne(taskId: string, sopId: string, user: User): Promise<TaskSOP> {
    // Verify task exists and user has access
    await this.tasksService.findOne(taskId, user);

    const taskSOP = await this.taskSOPRepository.findOne({
      where: {
        id: sopId,
        task: { id: taskId },
        isActive: true
      },
      relations: ['createdBy', 'updatedBy', 'completedBy']
    });

    if (!taskSOP) {
      throw new NotFoundException(`Task SOP step not found`);
    }

    return taskSOP;
  }

  async update(
    taskId: string,
    sopId: string,
    updateTaskSOPDto: UpdateTaskSOPDto,
    user: User
  ): Promise<TaskSOP> {
    const taskSOP = await this.findOne(taskId, sopId, user);

    // If step number is being changed, check for conflicts
    if (updateTaskSOPDto.stepNumber && updateTaskSOPDto.stepNumber !== taskSOP.stepNumber) {
      const existingStep = await this.taskSOPRepository.findOne({
        where: {
          task: { id: taskId },
          stepNumber: updateTaskSOPDto.stepNumber,
          isActive: true
        }
      });

      if (existingStep) {
        throw new BadRequestException(`Step number ${updateTaskSOPDto.stepNumber} already exists`);
      }
    }

    const updatedSOP = this.taskSOPRepository.merge(taskSOP, {
      ...updateTaskSOPDto,
      updatedBy: user
    });

    return this.taskSOPRepository.save(updatedSOP);
  }

  async complete(
    taskId: string,
    sopId: string,
    completeDto: CompleteTaskSOPDto,
    user: User
  ): Promise<TaskSOP> {
    const taskSOP = await this.findOne(taskId, sopId, user);

    const completedSOP = this.taskSOPRepository.merge(taskSOP, {
      isCompleted: completeDto.isCompleted,
      completedBy: completeDto.isCompleted ? user : null,
      completedAt: completeDto.isCompleted ? new Date() : null,
      updatedBy: user
    });

    return this.taskSOPRepository.save(completedSOP);
  }

  async reorder(taskId: string, reorderDto: ReorderTaskSOPDto, user: User): Promise<TaskSOP[]> {
    // Verify task exists and user has access
    await this.tasksService.findOne(taskId, user);

    // Get all active steps
    const steps = await this.taskSOPRepository.find({
      where: {
        task: { id: taskId },
        isActive: true
      }
    });

    // Validate reorder input
    if (steps.length !== reorderDto.stepOrder.length) {
      throw new BadRequestException('Reorder array must contain all active steps');
    }

    // Update step numbers
    const updates = steps.map((step, index) => {
      return this.taskSOPRepository.save({
        ...step,
        stepNumber: reorderDto.stepOrder[index],
        updatedBy: user
      });
    });

    return Promise.all(updates);
  }

  async remove(taskId: string, sopId: string, user: User): Promise<void> {
    const taskSOP = await this.findOne(taskId, sopId, user);
    
    await this.taskSOPRepository.save({
      ...taskSOP,
      isActive: false,
      updatedBy: user
    });
  }
}

