import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  RegisterDto,
  comRegDto,
  createUserAdminDto,
  forgotDto,
  loginDto,
  resetDto,
} from './dto/auth.dto';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body(new ValidationPipe()) registerDto: RegisterDto) {
    try {
      const res = await this.authService.register(registerDto);
      return res;
    } catch (error) {
      console.log({ error });
      throw error;
    }
  }

  @Post('login')
  async login(@Body(new ValidationPipe()) loginData: loginDto) {
    try {
      const res = await this.authService.login(loginData);
      return res;
    } catch (error) {
      console.log({ error });
      throw error;
    }
  }

  @Get('verify/:token')
  async verifyConfirmationToken(@Param('token') token: string) {
    try {
      const res = await this.authService.verifyToken(token);

      return res;
    } catch (error) {
      console.log({ error });
      throw error;
    }
  }

  @Post('forgotPassword')
  async forgotPassword(@Body(new ValidationPipe()) forgotData: forgotDto) {
    try {
      await this.authService.forgotPassword(forgotData.email);

      return { message: 'forgot password email sent!' };
    } catch (error) {
      console.log({ error });
      throw error;
    }
  }

  // @Post('resetPassword')
  // async resetPassword(@Body(new ValidationPipe()) resetData: resetDto) {
  //   try {
  //     const res = await this.authService.resetPassword(resetData);

  //     return res;
  //   } catch (error) {
  //     console.log({ error });
  //     throw error;
  //   }
  // }

  @Post('createUserAdmin')
  async createUserAdmin(@Body(new ValidationPipe()) data: createUserAdminDto) {
    try {
      const res = await this.authService.adminCreateUser(data);

      return res;
    } catch (error) {
      console.log({ error });
      throw error;
    }
  }

  @Post('completeRegistration')
  async completeRegistration(@Body(new ValidationPipe()) data: comRegDto) {
    try {
      const res = await this.authService.completeRegistration(data);

      return res;
    } catch (error) {
      console.log({ error });
      throw error;
    }
  }
}
