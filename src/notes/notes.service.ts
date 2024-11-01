import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Note } from './notes.entity';
import { CreateNoteDto, UpdateNoteDto } from './dto/notes.dto';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private notesRepository: Repository<Note>,
  ) {}

  async create(createNoteDto: CreateNoteDto, userId: string): Promise<Note> {
    const note = this.notesRepository.create({
      ...createNoteDto,
      createdBy: userId,
    });
    return await this.notesRepository.save(note);
  }

  async findAll(userId: string): Promise<Note[]> {
    return await this.notesRepository.find({
      where: [
        { createdBy: userId },  // Notes created by the user
        { sharedWith: userId }, // Notes shared with the user
      ],
      order: {
        createdAt: 'DESC'  // Most recent notes first
      }
    });
  }


  async findOne(id: string): Promise<Note> {
    const note = await this.notesRepository.findOne({ where: { id } });
    if (!note) {
      throw new NotFoundException(`Note with ID ${id} not found`);
    }
    return note;
  }

  async update(id: string, updateNoteDto: UpdateNoteDto): Promise<Note> {
    const note = await this.findOne(id);
    const updatedNote = Object.assign(note, updateNoteDto);
    return await this.notesRepository.save(updatedNote);
  }

  async remove(id: string): Promise<void> {
    const result = await this.notesRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Note with ID ${id} not found`);
    }
  }
}
