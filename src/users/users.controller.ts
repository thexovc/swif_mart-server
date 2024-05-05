import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/guard/auth.guard';
import { UpdatePasswordDto, UpdateUserDto } from './dto/user.dto';
import { Roles } from 'src/guard/roles.decorator';

@Controller('api/user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // get user
  @UseGuards(AuthGuard)
  @Roles()
  @Get()
  async getUser(@Request() req) {
    try {
      return await this.usersService.getUser(req.user.id);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // admin get user
  @UseGuards(AuthGuard)
  @Roles('admin')
  @Get('admin/:id')
  async adminGetUser(@Param('id') id) {
    try {
      return await this.usersService.getUser(id);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // update user
  @UseGuards(AuthGuard)
  @Roles()
  @Put()
  async updateUser(
    @Request() req,
    @Body(new ValidationPipe()) UpdateUserDto: UpdateUserDto,
  ) {
    try {
      return await this.usersService.updateUser(req.user.id, UpdateUserDto);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // admin update user
  @UseGuards(AuthGuard)
  @Roles('admin')
  @Put('update/:id')
  async adminUpdateUser(
    @Param('id') id,
    @Body(new ValidationPipe()) UpdateUserDto: UpdateUserDto,
  ) {
    try {
      return await this.usersService.updateUser(id, UpdateUserDto);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // change password
  @UseGuards(AuthGuard)
  @Roles()
  @Put('changePassword')
  async changePassword(
    @Request() req,
    @Body(new ValidationPipe()) UpdatePasswordDto: UpdatePasswordDto,
  ) {
    try {
      return await this.usersService.updatePassword(
        req.user.id,
        UpdatePasswordDto,
      );
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // get users routes
  @UseGuards(AuthGuard)
  @Roles('admin')
  @Get('all')
  async getAllUsers(
    @Query('limit') limit: number = 10,
    @Query('page') page: number = 1,
  ) {
    return this.usersService.getAllUsers({ limit, page });
  }

  @UseGuards(AuthGuard)
  @Roles('admin')
  @Get('admins')
  async getAllAdmins(
    @Query('limit') limit: number = 10,
    @Query('page') page: number = 1,
  ) {
    return this.usersService.getAllAdmins({ limit, page });
  }
}
