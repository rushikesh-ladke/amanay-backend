import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NoteAccessService } from './note-access.service';
import { NoteAccessController } from './note-access.controller';
import { NoteAccess } from './entities/note-access.entity';
import { NotesModule } from '../notes/notes.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([NoteAccess]),
    NotesModule
  ],
  controllers: [NoteAccessController],
  providers: [NoteAccessService],
  exports: [NoteAccessService]
})
export class NoteAccessModule {}