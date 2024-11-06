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
  import { QuestionsService } from './questions.service';
  import { CreateQuestionDto, UpdateQuestionDto, AnswerQuestionDto } from './dto/question.dto';
  import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
  
  @ApiTags('questions')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Controller('questions')
  export class QuestionsController {
    constructor(private readonly questionsService: QuestionsService) {}
  
    @Post()
    @ApiOperation({ summary: 'Create a new question' })
    create(@Body() createQuestionDto: CreateQuestionDto, @Request() req) {
      return this.questionsService.create(createQuestionDto, req.user);
    }
  
    @Get()
    @ApiOperation({ summary: 'Get all questions for current user' })
    findAll(@Request() req) {
      return this.questionsService.findAll(req.user);
    }
  
    @Get(':id')
    @ApiOperation({ summary: 'Get a specific question by ID' })
    findOne(@Param('id') id: string, @Request() req) {
      return this.questionsService.findOne(id, req.user);
    }
  
    @Patch(':id')
    @ApiOperation({ summary: 'Update a question' })
    update(
      @Param('id') id: string, 
      @Body() updateQuestionDto: UpdateQuestionDto,
      @Request() req
    ) {
      return this.questionsService.update(id, updateQuestionDto, req.user);
    }
  
    @Post(':id/answer')
    @ApiOperation({ summary: 'Answer a question' })
    answer(
      @Param('id') id: string,
      @Body() answerDto: AnswerQuestionDto,
      @Request() req
    ) {
      return this.questionsService.answer(id, answerDto, req.user);
    }
  
    @Delete(':id')
    @ApiOperation({ summary: 'Soft delete a question' })
    remove(@Param('id') id: string, @Request() req) {
      return this.questionsService.remove(id, req.user);
    }
  }
  