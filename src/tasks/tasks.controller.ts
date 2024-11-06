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
  import { TasksService } from './tasks.service';
  import { CreateTaskDto, UpdateTaskDto, CompleteTaskDto } from './dto/task.dto';
  import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
  import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
  
  @ApiTags('tasks')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Controller('tasks')
  export class TasksController {
    constructor(private readonly tasksService: TasksService) {}
  
    @Post()
    @ApiOperation({ summary: 'Create a new task' })
    create(@Body() createTaskDto: CreateTaskDto, @Request() req) {
      return this.tasksService.create(createTaskDto, req.user);
    }
  
    @Get()
    @ApiOperation({ summary: 'Get all tasks for current user' })
    findAll(@Request() req) {
      return this.tasksService.findAll(req.user);
    }
  
    @Get(':id')
    @ApiOperation({ summary: 'Get a specific task by ID' })
    findOne(@Param('id') id: string, @Request() req) {
      return this.tasksService.findOne(id, req.user);
    }
  
    @Patch(':id')
    @ApiOperation({ summary: 'Update a task' })
    update(
      @Param('id') id: string, 
      @Body() updateTaskDto: UpdateTaskDto,
      @Request() req
    ) {
      return this.tasksService.update(id, updateTaskDto, req.user);
    }
  
    @Post(':id/complete')
    @ApiOperation({ summary: 'Complete a task' })
    complete(
      @Param('id') id: string,
      @Body() completeTaskDto: CompleteTaskDto,
      @Request() req
    ) {
      return this.tasksService.complete(id, completeTaskDto, req.user);
    }
  
    @Delete(':id')
    @ApiOperation({ summary: 'Soft delete a task' })
    remove(@Param('id') id: string, @Request() req) {
      return this.tasksService.remove(id, req.user);
    }
  }
  