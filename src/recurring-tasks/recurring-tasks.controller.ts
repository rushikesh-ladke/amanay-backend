import { 
    Controller, 
    Get, 
    Post, 
    Body, 
    Patch, 
    Param, 
    Delete, 
    UseGuards,
    Request,
    Query 
  } from '@nestjs/common';
  import { RecurringTasksService } from './recurring-tasks.service';
  import { CreateRecurringTaskDto, UpdateRecurringTaskDto, CompleteRecurringTaskDto } from './dto/recurring-task.dto';
  import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
  
  @ApiTags('recurring-tasks')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Controller('tasks/:taskId/recurring')
  export class RecurringTasksController {
    constructor(private readonly recurringTasksService: RecurringTasksService) {}
  
    @Post()
    @ApiOperation({ summary: 'Create a recurring schedule for a task' })
    create(
      @Param('taskId') taskId: string,
      @Body() createRecurringTaskDto: CreateRecurringTaskDto,
      @Request() req
    ) {
      return this.recurringTasksService.create(taskId, createRecurringTaskDto, req.user);
    }
  
    @Get()
    @ApiOperation({ summary: 'Get all recurring schedules for a task' })
    findAll(@Param('taskId') taskId: string, @Request() req) {
      return this.recurringTasksService.findAll(taskId, req.user);
    }
  
    @Get('pending')
    @ApiOperation({ summary: 'Get all pending recurring tasks' })
    findPending(@Request() req) {
      return this.recurringTasksService.findPending(req.user);
    }
  
    @Get('upcoming')
    @ApiOperation({ summary: 'Get upcoming recurring tasks' })
    findUpcoming(
      @Query('days') days: number,
      @Request() req
    ) {
      return this.recurringTasksService.findUpcoming(req.user, days);
    }
  
    @Get(':recurringId')
    @ApiOperation({ summary: 'Get a specific recurring schedule' })
    findOne(
      @Param('taskId') taskId: string,
      @Param('recurringId') recurringId: string,
      @Request() req
    ) {
      return this.recurringTasksService.findOne(taskId, recurringId, req.user);
    }
  
    @Patch(':recurringId')
    @ApiOperation({ summary: 'Update a recurring schedule' })
    update(
      @Param('taskId') taskId: string,
      @Param('recurringId') recurringId: string,
      @Body() updateRecurringTaskDto: UpdateRecurringTaskDto,
      @Request() req
    ) {
      return this.recurringTasksService.update(taskId, recurringId, updateRecurringTaskDto, req.user);
    }
  
    @Post(':recurringId/complete')
    @ApiOperation({ summary: 'Complete a recurring task instance' })
    complete(
      @Param('taskId') taskId: string,
      @Param('recurringId') recurringId: string,
      @Body() completeDto: CompleteRecurringTaskDto,
      @Request() req
    ) {
      return this.recurringTasksService.complete(taskId, recurringId, completeDto, req.user);
    }
  
    @Delete(':recurringId')
    @ApiOperation({ summary: 'Remove a recurring schedule' })
    remove(
      @Param('taskId') taskId: string,
      @Param('recurringId') recurringId: string,
      @Request() req
    ) {
      return this.recurringTasksService.remove(taskId, recurringId, req.user);
    }
  }
  
  