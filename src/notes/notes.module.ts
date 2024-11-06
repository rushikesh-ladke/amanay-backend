import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotesService } from './notes.service';
import { NotesController } from './notes.controller';
import { Note } from './entities/notes.entity';
import { NoteAccess } from '../note-access/entities/note-access.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Note, NoteAccess])
  ],
  controllers: [NotesController],
  providers: [NotesService],
  exports: [NotesService]
})
export class NotesModule {}
