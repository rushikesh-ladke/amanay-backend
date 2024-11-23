// src/user/user.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth,
  ApiQuery 
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { User } from './user.entity';
import { UpdateUserSettingsDto } from './dto/update-user-settings.dto';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User has been successfully created.',
    type: User,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Email already exists.',
  })
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  // @Get()
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  // @ApiOperation({ summary: 'Get all users' })
  // @ApiQuery({ name: 'page', required: false, type: Number })
  // @ApiQuery({ name: 'limit', required: false, type: Number })
  // @ApiResponse({
  //   status: HttpStatus.OK,
  //   description: 'Return all users.',
  //   type: [User],
  // })
  // async findAll(
  //   @Query('page') page: number = 1,
  //   @Query('limit') limit: number = 10,
  // ) {
  //   return this.userService.findAll(page, limit);
  // }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return the user.',
    type: User,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found.',
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.findById(id);
  }

  // @Patch(':id')
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  // @ApiOperation({ summary: 'Update user information' })
  // @ApiResponse({
  //   status: HttpStatus.OK,
  //   description: 'User has been successfully updated.',
  //   type: User,
  // })
  // @ApiResponse({
  //   status: HttpStatus.NOT_FOUND,
  //   description: 'User not found.',
  // })
  // async update(
  //   @Param('id', ParseUUIDPipe) id: string,
  //   @Body() updateUserDto: UpdateUserDto,
  // ) {
  //   return this.userService.update(id, updateUserDto);
  // }

  // @Delete(':id')
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  // @ApiOperation({ summary: 'Delete user' })
  // @ApiResponse({
  //   status: HttpStatus.OK,
  //   description: 'User has been successfully deleted.',
  // })
  // @ApiResponse({
  //   status: HttpStatus.NOT_FOUND,
  //   description: 'User not found.',
  // })
  // async remove(@Param('id', ParseUUIDPipe) id: string) {
  //   return this.userService.remove(id);
  // }

  // @Patch(':id/deactivate')
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  // @ApiOperation({ summary: 'Deactivate user account' })
  // @ApiResponse({
  //   status: HttpStatus.OK,
  //   description: 'User has been successfully deactivated.',
  // })
  // async deactivate(@Param('id', ParseUUIDPipe) id: string) {
  //   return this.userService.deactivate(id);
  // }

  // @Patch(':id/activate')
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  // @ApiOperation({ summary: 'Activate user account' })
  // @ApiResponse({
  //   status: HttpStatus.OK,
  //   description: 'User has been successfully activated.',
  // })
  // async activate(@Param('id', ParseUUIDPipe) id: string) {
  //   return this.userService.activate(id);
  // }

  @Get(':id/settings')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user settings' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return the user settings.',
    type: User,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found.',
  })
  async getUserSettings(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.getUserSettings(id);
  }

  @Patch(':id/settings')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user settings' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Settings have been successfully updated.',
    type: User,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found.',
  })
  async updateSettings(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateSettingsDto: UpdateUserSettingsDto,
  ) {
    return this.userService.updateSettings(id, updateSettingsDto);
  }
}
