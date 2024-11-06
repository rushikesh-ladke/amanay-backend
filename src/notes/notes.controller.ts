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
import { NotesService } from './notes.service';
import { CreateNoteDto, UpdateNoteDto, NoteAccessDto } from './dto/create-note.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';

@ApiTags('notes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new note' })
  create(@Body() createNoteDto: CreateNoteDto, @Request() req) {
    return this.notesService.create(createNoteDto, req.user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all notes for current user' })
  findAll(@Request() req) {
    return this.notesService.findAll(req.user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific note by ID' })
  findOne(@Param('id') id: string, @Request() req) {
    return this.notesService.findOne(id, req.user);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a note' })
  update(
    @Param('id') id: string, 
    @Body() updateNoteDto: UpdateNoteDto,
    @Request() req
  ) {
    return this.notesService.update(id, updateNoteDto, req.user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete a note' })
  remove(@Param('id') id: string, @Request() req) {
    return this.notesService.remove(id, req.user);
  }

  @Post(':id/access')
  @ApiOperation({ summary: 'Grant access to a note' })
  grantAccess(
    @Param('id') id: string,
    @Body() accessDto: NoteAccessDto,
    @Request() req
  ) {
    return this.notesService.grantAccess(id, accessDto, req.user);
  }
}
