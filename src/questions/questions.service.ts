import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from './entities/question.entity';
import { CreateQuestionDto, UpdateQuestionDto, AnswerQuestionDto } from './dto/question.dto';
import { NotesService } from '../notes/notes.service';
import { TasksService } from '../tasks/tasks.service';
import { User } from 'src/user/user.entity';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
    private notesService: NotesService,
    private tasksService: TasksService,
  ) {}

  async create(createQuestionDto: CreateQuestionDto, user: User): Promise<Question> {
    // Verify note exists and user has access
    const note = await this.notesService.findOne(createQuestionDto.noteId, user);

    let task = null;
    if (createQuestionDto.taskId) {
      task = await this.tasksService.findOne(createQuestionDto.taskId, user);
      
      // Verify task belongs to the note
      if (task.note.id !== note.id) {
        throw new BadRequestException('Task does not belong to the specified note');
      }
    }

    const question = this.questionRepository.create({
      ...createQuestionDto,
      note,
      task,
      askedBy: user,
      updatedBy: user,
      askedTo: { id: createQuestionDto.askedToId } as User,
    });

    return this.questionRepository.save(question);
  }

  async findAll(user: User): Promise<Question[]> {
    return this.questionRepository.find({
      where: [
        { askedBy: { id: user.id }, isActive: true },
        { askedTo: { id: user.id }, isActive: true }
      ],
      relations: ['askedBy', 'askedTo', 'answeredBy', 'note', 'task'],
      order: { createdAt: 'DESC' }
    });
  }

  async findOne(id: string, user: User): Promise<Question> {
    const question = await this.questionRepository.findOne({
      where: { 
        id,
        isActive: true
      },
      relations: ['askedBy', 'askedTo', 'answeredBy', 'note', 'task']
    });

    if (!question) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }

    // Check if user has access
    if (question.askedBy.id !== user.id && question.askedTo.id !== user.id) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }

    return question;
  }

  async update(id: string, updateQuestionDto: UpdateQuestionDto, user: User): Promise<Question> {
    const question = await this.findOne(id, user);
    
    // Only askedBy can update the question or askedTo
    if (question.askedBy.id !== user.id) {
      throw new BadRequestException('Only the person who asked the question can update it');
    }

    const updatedQuestion = this.questionRepository.merge(question, {
      ...updateQuestionDto,
      updatedBy: user,
      askedTo: updateQuestionDto.askedToId ? { id: updateQuestionDto.askedToId } as User : question.askedTo
    });

    return this.questionRepository.save(updatedQuestion);
  }

  async answer(id: string, answerDto: AnswerQuestionDto, user: User): Promise<Question> {
    const question = await this.findOne(id, user);

    // Only askedTo can answer the question
    if (question.askedTo.id !== user.id) {
      throw new BadRequestException('Only the person who was asked can answer the question');
    }

    if (question.answer) {
      throw new BadRequestException('Question has already been answered');
    }

    const answeredQuestion = this.questionRepository.merge(question, {
      answer: answerDto.answer,
      answeredBy: user,
      answeredAt: new Date(),
      updatedBy: user
    });

    return this.questionRepository.save(answeredQuestion);
  }

  async remove(id: string, user: User): Promise<void> {
    const question = await this.findOne(id, user);
    
    // Only askedBy can delete the question
    if (question.askedBy.id !== user.id) {
      throw new BadRequestException('Only the person who asked the question can delete it');
    }

    await this.questionRepository.save({
      ...question,
      isActive: false,
      updatedBy: user
    });
  }
}
