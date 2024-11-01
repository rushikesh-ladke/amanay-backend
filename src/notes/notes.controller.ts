import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Body,
    Param,
    UseGuards,
    HttpStatus,
    ParseUUIDPipe,
  } from '@nestjs/common';
  import { 
    ApiTags, 
    ApiOperation, 
    ApiResponse, 
    ApiBearerAuth,
  } from '@nestjs/swagger';
  import { NotesService } from './notes.service';
  import { CreateNoteDto, UpdateNoteDto } from './dto/notes.dto';
  import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
  import { Note } from './notes.entity';
import { User } from 'src/decorators/user.decorator';
  
  @ApiTags('notes')
  @Controller('notes')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  export class NotesController {
    constructor(private readonly notesService: NotesService) {}
  
    @Post()
    @ApiOperation({ summary: 'Create a new note' })
    @ApiResponse({
      status: HttpStatus.CREATED,
      description: 'Note has been successfully created.',
      type: Note,
    })
    @ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Invalid input data.',
    })
    @ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'User is not authorized.',
    })
    async create(
      @Body() createNoteDto: CreateNoteDto, 
      @User('id', ParseUUIDPipe) userId: string
    ) {
      return this.notesService.create(createNoteDto, userId);
    }
  
    @Get()
    @ApiOperation({ summary: 'Get all notes' })
    @ApiResponse({
      status: HttpStatus.OK,
      description: 'Returns all accessible notes for the user.',
      type: [Note],
    })
    @ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'User is not authorized.',
    })
    async findAll(
      @User('id', ParseUUIDPipe) userId: string
    ) {
      return this.notesService.findAll(userId);
    }
  
    // @Get(':id')
    // @ApiOperation({ summary: 'Get note by id' })
    // @ApiResponse({
    //   status: HttpStatus.OK,
    //   description: 'Returns the note if user has access.',
    //   type: Note,
    // })
    // @ApiResponse({
    //   status: HttpStatus.NOT_FOUND,
    //   description: 'Note not found.',
    // })
    // @ApiResponse({
    //   status: HttpStatus.UNAUTHORIZED,
    //   description: 'User is not authorized.',
    // })
    // @ApiResponse({
    //   status: HttpStatus.FORBIDDEN,
    //   description: 'User does not have access to this note.',
    // })
    // async findOne(
    //   @Param('id', ParseUUIDPipe) id: string,
    //   @User('id', ParseUUIDPipe) userId: string
    // ) {
    //   return this.notesService.findOne(id, userId);
    // }
  
    // @Patch(':id')
    // @ApiOperation({ summary: 'Update note' })
    // @ApiResponse({
    //   status: HttpStatus.OK,
    //   description: 'Note has been successfully updated.',
    //   type: Note,
    // })
    // @ApiResponse({
    //   status: HttpStatus.NOT_FOUND,
    //   description: 'Note not found.',
    // })
    // @ApiResponse({
    //   status: HttpStatus.UNAUTHORIZED,
    //   description: 'User is not authorized.',
    // })
    // @ApiResponse({
    //   status: HttpStatus.FORBIDDEN,
    //   description: 'User does not have permission to update this note.',
    // })
    // async update(
    //   @Param('id', ParseUUIDPipe) id: string, 
    //   @Body() updateNoteDto: UpdateNoteDto,
    //   @User('id', ParseUUIDPipe) userId: string
    // ) {
    //   return this.notesService.update(id, updateNoteDto, userId);
    // }
  
    // @Delete(':id')
    // @ApiOperation({ summary: 'Delete note' })
    // @ApiResponse({
    //   status: HttpStatus.OK,
    //   description: 'Note has been successfully deleted.',
    // })
    // @ApiResponse({
    //   status: HttpStatus.NOT_FOUND,
    //   description: 'Note not found.',
    // })
    // @ApiResponse({
    //   status: HttpStatus.UNAUTHORIZED,
    //   description: 'User is not authorized.',
    // })
    // @ApiResponse({
    //   status: HttpStatus.FORBIDDEN,
    //   description: 'User does not have permission to delete this note.',
    // })
    // async remove(
    //   @Param('id', ParseUUIDPipe) id: string,
    //   @User('id', ParseUUIDPipe) userId: string
    // ) {
    //   return this.notesService.remove(id, userId);
    // }
  }