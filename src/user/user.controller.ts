import {
    Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards, ParseIntPipe
  } from '@nestjs/common';
  import { UserService } from './user.service';
  import { CreateUserDto } from './dto/create-user.dto';
  import { UpdateUserDto } from './dto/update-user.dto';
  import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
  
  @Controller('users')
  @UseGuards(JwtAuthGuard)  // Apply to all routes
  export class UserController {
    constructor(private readonly userService: UserService) {}
  
    @Get()
    findAll(@Request() req) {
      return this.userService.getAllUsers(req.user.role); // Pass the role from the request
    }
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
    }
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
      return this.userService.getUserById(id, req.user.role);
    }
  
    @Post()
    create(@Body() createUserDto: CreateUserDto, @Request() req) {
      return this.userService.createUser(createUserDto, req.user.role);
    }
  
    @Patch(':id')
    update(
      @Param('id', ParseIntPipe) id: number,
      @Body() updateUserDto: UpdateUserDto,
      @Request() req,
    ) {
      return this.userService.updateUser(id, updateUserDto, req.user.role);
    }
  
    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
      return this.userService.deleteUser(id, req.user.role);
    }
  }
  