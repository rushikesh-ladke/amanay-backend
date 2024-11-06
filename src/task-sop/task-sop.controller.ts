import { 
    Controller, 
    Get, 
    Post, 
    Body, 
    Patch, 
    Param, 
    Delete, 
    UseGuards,
    Request 
  } from '@nestjs/common';
  import { TaskSOPService } from './task-sop.service';
  import { CreateTaskSOPDto, UpdateTaskSOPDto, CompleteTaskSOPDto, ReorderTaskSOPDto } from './dto/task-sop.dto';
  import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
  
  @ApiTags('task-sop')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Controller('tasks/:taskId/sop')
  export class TaskSOPController {
    constructor(private readonly taskSOPService: TaskSOPService) {}
  
    @Post()
    @ApiOperation({ summary: 'Create a new SOP step for a task' })
    create(
      @Param('taskId') taskId: string,
      @Body() createTaskSOPDto: CreateTaskSOPDto,
      @Request() req
    ) {
      return this.taskSOPService.create(taskId, createTaskSOPDto, req.user);
    }
  
    @Get()
    @ApiOperation({ summary: 'Get all SOP steps for a task' })
    findAll(@Param('taskId') taskId: string, @Request() req) {
      return this.taskSOPService.findAll(taskId, req.user);
    }
  
    @Get(':sopId')
    @ApiOperation({ summary: 'Get a specific SOP step' })
    findOne(
      @Param('taskId') taskId: string,
      @Param('sopId') sopId: string,
      @Request() req
    ) {
      return this.taskSOPService.findOne(taskId, sopId, req.user);
    }
  
    @Patch(':sopId')
    @ApiOperation({ summary: 'Update a SOP step' })
    update(
      @Param('taskId') taskId: string,
      @Param('sopId') sopId: string,
      @Body() updateTaskSOPDto: UpdateTaskSOPDto,
      @Request() req
    ) {
      return this.taskSOPService.update(taskId, sopId, updateTaskSOPDto, req.user);
    }
  
    @Post(':sopId/complete')
    @ApiOperation({ summary: 'Complete a SOP step' })
    complete(
      @Param('taskId') taskId: string,
      @Param('sopId') sopId: string,
      @Body() completeDto: CompleteTaskSOPDto,
      @Request() req
    ) {
      return this.taskSOPService.complete(taskId, sopId, completeDto, req.user);
    }
  
    @Post('reorder')
    @ApiOperation({ summary: 'Reorder SOP steps' })
    reorder(
      @Param('taskId') taskId: string,
      @Body() reorderDto: ReorderTaskSOPDto,
      @Request() req
    ) {
      return this.taskSOPService.reorder(taskId, reorderDto, req.user);
    }
  
    @Delete(':sopId')
    @ApiOperation({ summary: 'Remove a SOP step' })
    remove(
      @Param('taskId') taskId: string,
      @Param('sopId') sopId: string,
      @Request() req
    ) {
      return this.taskSOPService.remove(taskId, sopId, req.user);
    }
  }
  