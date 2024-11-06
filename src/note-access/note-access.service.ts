import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NoteAccess, AccessType } from './entities/note-access.entity';
import { CreateNoteAccessDto, UpdateNoteAccessDto } from './dto/note-access.dto';
import { User } from '../user/user.entity';
import { NotesService } from '../notes/notes.service';

@Injectable()
export class NoteAccessService {
  constructor(
    @InjectRepository(NoteAccess)
    private noteAccessRepository: Repository<NoteAccess>,
    private notesService: NotesService,
  ) {}

  async create(
    noteId: string, 
    createNoteAccessDto: CreateNoteAccessDto, 
    user: User
  ): Promise<NoteAccess> {
    // Verify note exists and user has admin access
    const note = await this.notesService.findOne(noteId, user);

    // Check if user is note owner or has admin access
    const hasAdminAccess = note.createdBy.id === user.id || 
                          await this.hasAccess(noteId, user.id, AccessType.ADMIN);
    
    if (!hasAdminAccess) {
      throw new BadRequestException('You do not have permission to grant access to this note');
    }

    // Check if access already exists
    const existingAccess = await this.noteAccessRepository.findOne({
      where: {
        note: { id: noteId },
        user: { id: createNoteAccessDto.userId },
        isActive: true
      }
    });

    if (existingAccess) {
      throw new BadRequestException('User already has access to this note');
    }

    const noteAccess = this.noteAccessRepository.create({
      note: { id: noteId },
      user: { id: createNoteAccessDto.userId },
      accessGivenBy: user,
      updatedBy: user,
      accessType: createNoteAccessDto.accessType || AccessType.READ
    });

    return this.noteAccessRepository.save(noteAccess);
  }

  async findAll(noteId: string, user: User): Promise<NoteAccess[]> {
    // Verify note exists and user has access
    await this.notesService.findOne(noteId, user);

    return this.noteAccessRepository.find({
      where: {
        note: { id: noteId },
        isActive: true
      },
      relations: ['user', 'accessGivenBy', 'updatedBy'],
      order: { accessGrantedAt: 'DESC' }
    });
  }

  async findOne(noteId: string, accessId: string, user: User): Promise<NoteAccess> {
    // Verify note exists and user has access
    await this.notesService.findOne(noteId, user);

    const noteAccess = await this.noteAccessRepository.findOne({
      where: {
        id: accessId,
        note: { id: noteId },
        isActive: true
      },
      relations: ['user', 'accessGivenBy', 'updatedBy']
    });

    if (!noteAccess) {
      throw new NotFoundException(`Access record not found`);
    }

    return noteAccess;
  }

  async update(
    noteId: string,
    accessId: string, 
    updateNoteAccessDto: UpdateNoteAccessDto,
    user: User
  ): Promise<NoteAccess> {
    const noteAccess = await this.findOne(noteId, accessId, user);

    // Check if user has admin access
    const hasAdminAccess = await this.hasAccess(noteId, user.id, AccessType.ADMIN);
    if (!hasAdminAccess) {
      throw new BadRequestException('You do not have permission to update access settings');
    }

    const updatedAccess = this.noteAccessRepository.merge(noteAccess, {
      ...updateNoteAccessDto,
      updatedBy: user
    });

    return this.noteAccessRepository.save(updatedAccess);
  }

  async remove(noteId: string, accessId: string, user: User): Promise<void> {
    const noteAccess = await this.findOne(noteId, accessId, user);

    // Check if user has admin access
    const hasAdminAccess = await this.hasAccess(noteId, user.id, AccessType.ADMIN);
    if (!hasAdminAccess) {
      throw new BadRequestException('You do not have permission to remove access');
    }

    await this.noteAccessRepository.save({
      ...noteAccess,
      isActive: false,
      updatedBy: user
    });
  }

  private async hasAccess(noteId: string, userId: string, requiredAccess: AccessType): Promise<boolean> {
    const access = await this.noteAccessRepository.findOne({
      where: {
        note: { id: noteId },
        user: { id: userId },
        isActive: true
      }
    });

    if (!access) return false;

    const accessLevels = {
      [AccessType.READ]: 0,
      [AccessType.WRITE]: 1,
      [AccessType.ADMIN]: 2
    };

    return accessLevels[access.accessType] >= accessLevels[requiredAccess];
  }
}
