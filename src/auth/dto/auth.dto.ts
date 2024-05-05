/* eslint-disable prettier/prettier */
// src/users/dto/user.dto.ts
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

enum UserRole {
  user = 'user',
  admin = 'admin',
}

export class RegisterDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class loginDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  passCode: string;
}

export class forgotDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class refreshDto {
  @IsNotEmpty()
  @IsString()
  refreshToken: string;
}

export class resetDto {
  @IsNotEmpty()
  @IsString()
  token: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export class createUserAdminDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  fullName: string;

  @IsNotEmpty()
  @IsEnum(UserRole, {
    message: 'Invalid role. Must be one of: user, admin',
  })
  role: string;
}
export class createProxyUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  fullName: string;
}

export class comRegDto {
  @IsNotEmpty()
  @IsString()
  token: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
