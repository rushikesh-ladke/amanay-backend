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
  import { NoteAccessService } from './note-access.service';
  import { CreateNoteAccessDto, UpdateNoteAccessDto } from './dto/note-access.dto';
  import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
  
  @ApiTags('note-access')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Controller('notes/:noteId/access')
  export class NoteAccessController {
    constructor(private readonly noteAccessService: NoteAccessService) {}
  
    @Post()
    @ApiOperation({ summary: 'Grant access to a note' })
    create(
      @Param('noteId') noteId: string,
      @Body() createNoteAccessDto: CreateNoteAccessDto, 
      @Request() req
    ) {
      return this.noteAccessService.create(noteId, createNoteAccessDto, req.user);
    }
  
    @Get()
    @ApiOperation({ summary: 'Get all access records for a note' })
    findAll(@Param('noteId') noteId: string, @Request() req) {
      return this.noteAccessService.findAll(noteId, req.user);
    }
  
    @Get(':accessId')
    @ApiOperation({ summary: 'Get specific access record' })
    findOne(
      @Param('noteId') noteId: string,
      @Param('accessId') accessId: string, 
      @Request() req
    ) {
      return this.noteAccessService.findOne(noteId, accessId, req.user);
    }
  
    @Patch(':accessId')
    @ApiOperation({ summary: 'Update access settings' })
    update(
      @Param('noteId') noteId: string,
      @Param('accessId') accessId: string,
      @Body() updateNoteAccessDto: UpdateNoteAccessDto,
      @Request() req
    ) {
      return this.noteAccessService.update(noteId, accessId, updateNoteAccessDto, req.user);
    }
  
    @Delete(':accessId')
    @ApiOperation({ summary: 'Remove access' })
    remove(
      @Param('noteId') noteId: string,
      @Param('accessId') accessId: string, 
      @Request() req
    ) {
      return this.noteAccessService.remove(noteId, accessId, req.user);
    }
  }
  