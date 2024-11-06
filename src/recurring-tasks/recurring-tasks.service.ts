import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThan } from 'typeorm';
import { RecurringTask, RecurringFrequency } from './entities/recurring-task.entity';
import { CreateRecurringTaskDto, UpdateRecurringTaskDto, CompleteRecurringTaskDto } from './dto/recurring-task.dto';
import { User } from '../user/user.entity';
import { TasksService } from '../tasks/tasks.service';

@Injectable()
export class RecurringTasksService {
  constructor(
    @InjectRepository(RecurringTask)
    private recurringTaskRepository: Repository<RecurringTask>,
    private tasksService: TasksService,
  ) {}

  async create(
    taskId: string,
    createRecurringTaskDto: CreateRecurringTaskDto,
    user: User
  ): Promise<RecurringTask> {
    // Verify task exists and user has access
    const task = await this.tasksService.findOne(taskId, user);

    // Validate metadata based on frequency
    this.validateMetadata(createRecurringTaskDto.frequency, createRecurringTaskDto.metadata);

    const recurringTask = this.recurringTaskRepository.create({
      ...createRecurringTaskDto,
      task: { id: taskId },
      createdBy: user,
      updatedBy: user
    });

    return this.recurringTaskRepository.save(recurringTask);
  }

  async findAll(taskId: string, user: User): Promise<RecurringTask[]> {
    // Verify task exists and user has access
    await this.tasksService.findOne(taskId, user);

    return this.recurringTaskRepository.find({
      where: {
        task: { id: taskId },
        isActive: true
      },
      relations: ['createdBy', 'updatedBy', 'completedBy'],
      order: { scheduledDate: 'DESC' }
    });
  }

  async findPending(user: User): Promise<RecurringTask[]> {
    const now = new Date();
    return this.recurringTaskRepository.find({
      where: {
        isActive: true,
        isCompleted: false,
        scheduledDate: LessThanOrEqual(now)
      },
      relations: ['task', 'createdBy'],
      order: { scheduledDate: 'ASC' }
    });
  }

  async findUpcoming(user: User, days: number = 7): Promise<RecurringTask[]> {
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);

    return this.recurringTaskRepository.find({
      where: {
        isActive: true,
        isCompleted: false,
        scheduledDate: MoreThan(now)
      },
      relations: ['task', 'createdBy'],
      order: { scheduledDate: 'ASC' }
    });
  }

  async findOne(taskId: string, recurringId: string, user: User): Promise<RecurringTask> {
    // Verify task exists and user has access
    await this.tasksService.findOne(taskId, user);

    const recurringTask = await this.recurringTaskRepository.findOne({
      where: {
        id: recurringId,
        task: { id: taskId },
        isActive: true
      },
      relations: ['createdBy', 'updatedBy', 'completedBy']
    });

    if (!recurringTask) {
      throw new NotFoundException(`Recurring task record not found`);
    }

    return recurringTask;
  }

  async update(
    taskId: string,
    recurringId: string,
    updateRecurringTaskDto: UpdateRecurringTaskDto,
    user: User
  ): Promise<RecurringTask> {
    const recurringTask = await this.findOne(taskId, recurringId, user);

    if (updateRecurringTaskDto.frequency) {
      this.validateMetadata(
        updateRecurringTaskDto.frequency, 
        updateRecurringTaskDto.metadata || recurringTask.metadata
      );
    }

    const updatedTask = this.recurringTaskRepository.merge(recurringTask, {
      ...updateRecurringTaskDto,
      updatedBy: user
    });

    return this.recurringTaskRepository.save(updatedTask);
  }

  async complete(
    taskId: string,
    recurringId: string,
    completeDto: CompleteRecurringTaskDto,
    user: User
  ): Promise<RecurringTask> {
    const recurringTask = await this.findOne(taskId, recurringId, user);

    if (recurringTask.isCompleted) {
      throw new BadRequestException('This recurring task is already marked as completed');
    }

    const completedTask = this.recurringTaskRepository.merge(recurringTask, {
      isCompleted: completeDto.isCompleted,
      completedBy: user,
      completedDate: new Date(),
      updatedBy: user
    });

    return this.recurringTaskRepository.save(completedTask);
  }

  async remove(taskId: string, recurringId: string, user: User): Promise<void> {
    const recurringTask = await this.findOne(taskId, recurringId, user);
    
    await this.recurringTaskRepository.save({
      ...recurringTask,
      isActive: false,
      updatedBy: user
    });
  }

  private validateMetadata(frequency: RecurringFrequency, metadata: any): void {
    switch (frequency) {
      case RecurringFrequency.WEEKLY:
        if (!metadata?.dayOfWeek || metadata.dayOfWeek < 0 || metadata.dayOfWeek > 6) {
          throw new BadRequestException('Weekly recurring tasks require a valid dayOfWeek (0-6)');
        }
        break;
      case RecurringFrequency.MONTHLY:
        if (!metadata?.dayOfMonth || metadata.dayOfMonth < 1 || metadata.dayOfMonth > 31) {
          throw new BadRequestException('Monthly recurring tasks require a valid dayOfMonth (1-31)');
        }
        break;
      case RecurringFrequency.YEARLY:
        if (!metadata?.monthOfYear || metadata.monthOfYear < 1 || metadata.monthOfYear > 12) {
          throw new BadRequestException('Yearly recurring tasks require a valid monthOfYear (1-12)');
        }
        if (!metadata?.dayOfMonth || metadata.dayOfMonth < 1 || metadata.dayOfMonth > 31) {
          throw new BadRequestException('Yearly recurring tasks require a valid dayOfMonth (1-31)');
        }
        break;
    }
  }
}

