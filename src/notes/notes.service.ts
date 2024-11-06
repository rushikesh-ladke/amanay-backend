import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Note } from './entities/notes.entity';
import { CreateNoteDto, UpdateNoteDto, NoteAccessDto } from './dto/create-note.dto';
import { User } from '../user/user.entity';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private noteRepository: Repository<Note>,
  ) {}

  async create(createNoteDto: CreateNoteDto, user: User): Promise<Note> {
    const note = this.noteRepository.create({
      ...createNoteDto,
      createdBy: user,
      updatedBy: user,
    });

    // Check if nameId is unique
    const existingNote = await this.noteRepository.findOne({
      where: { nameId: createNoteDto.nameId }
    });

    if (existingNote) {
      throw new BadRequestException('Note with this nameId already exists');
    }

    return this.noteRepository.save(note);
  }

  async findAll(user: User): Promise<Note[]> {
    return this.noteRepository.find({
      where: { 
        isActive: true,
        createdBy: { id: user.id }
      },
      relations: ['createdBy', 'updatedBy', 'userAccess', 'tasks'],
      order: { createdAt: 'DESC' }
    });
  }

  async findOne(id: string, user: User): Promise<Note> {
    const note = await this.noteRepository.findOne({
      where: { 
        id,
        isActive: true
      },
      relations: ['createdBy', 'updatedBy', 'userAccess', 'tasks', 'questions', 'recurringLogs']
    });

    if (!note) {
      throw new NotFoundException(`Note with ID ${id} not found`);
    }

    // Check if user has access
    const hasAccess = note.createdBy.id === user.id || 
                     note.userAccess.some(access => access.user.id === user.id);

    if (!hasAccess) {
      throw new NotFoundException(`Note with ID ${id} not found`);
    }

    return note;
  }

  async update(id: string, updateNoteDto: UpdateNoteDto, user: User): Promise<Note> {
    const note = await this.findOne(id, user);
    
    const updatedNote = this.noteRepository.merge(note, {
      ...updateNoteDto,
      updatedBy: user
    });

    return this.noteRepository.save(updatedNote);
  }

  async remove(id: string, user: User): Promise<void> {
    const note = await this.findOne(id, user);
    await this.noteRepository.save({
      ...note,
      isActive: false,
      updatedBy: user
    });
  }

  async grantAccess(id: string, accessDto: NoteAccessDto, user: User): Promise<Note> {
    const note = await this.findOne(id, user);
    
    // Add user access logic here
    // This is a simplified version - you'll need to implement NoteAccess creation

    return note;
  }
}

