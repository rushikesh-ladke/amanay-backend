import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskSOPService } from './task-sop.service';
import { TaskSOPController } from './task-sop.controller';
import { TaskSOP } from './entities/task-sop.entity';
import { TasksModule } from '../tasks/tasks.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TaskSOP]),
    TasksModule
  ],
  controllers: [TaskSOPController],
  providers: [TaskSOPService],
  exports: [TaskSOPService]
})
export class TaskSOPModule {}
