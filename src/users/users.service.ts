import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UpdatePasswordDto, UpdateUserDto } from './dto/user.dto';
import * as bcrypt from 'bcryptjs';
import { UserRole } from '@prisma/client';
@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getUser(userId: string) {
    try {
      return await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          id: true,
          fullName: true,
          email: true,
          role: true,
          emailConfirmed: true,
          api_key: true,
          phoneNumber: true,
          resetToken: true,
          currentHashedRefreshToken: true,
          createdAt: true,
          updatedAt: true,
          // Exclude password field
          password: false,
        },
      });
    } catch (error) {
      throw new HttpException('No user found', HttpStatus.NOT_FOUND);
    }
  }

  async updateUser(userId: string, updateData: UpdateUserDto) {
    return await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: updateData,
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        emailConfirmed: true,
        api_key: true,
        phoneNumber: true,
        resetToken: true,
        currentHashedRefreshToken: true,
        createdAt: true,
        updatedAt: true,
        // Exclude password field
        password: false,
      },
    });
  }

  async updatePassword(userId: string, UpdatePasswordDto: UpdatePasswordDto) {
    if (UpdatePasswordDto.password != UpdatePasswordDto.confirmPassword) {
      throw new HttpException(
        'Password does not match',
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashedPassword = await bcrypt.hash(UpdatePasswordDto.password, 10);

    return await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        password: hashedPassword,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        emailConfirmed: true,
        api_key: true,
        phoneNumber: true,
        resetToken: true,
        currentHashedRefreshToken: true,
        createdAt: true,
        updatedAt: true,
        // Exclude password field
        password: false,
      },
    });
  }

  // get users routes

  async getAllUsers({ limit, page }): Promise<any> {
    const offset = Number(limit) * (Number(page) - 1);
    const totalMessagesCount = await this.prisma.user.count({
      where: {
        role: UserRole.user,
      },
    });

    const totalPages = Math.ceil(totalMessagesCount / limit);

    const users = await this.prisma.user.findMany({
      where: {
        role: UserRole.user,
      },
      skip: offset,
      take: Number(limit),
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        emailConfirmed: true,
        api_key: true,
        phoneNumber: true,
        resetToken: true,
        currentHashedRefreshToken: true,
        createdAt: true,
        updatedAt: true,
        // Exclude password field
        password: false,
      },
    });

    return { totalPages, users };
  }

  async getAllAdmins({ limit, page }): Promise<any> {
    const offset = Number(limit) * (Number(page) - 1);

    const totalMessagesCount = await this.prisma.user.count({
      where: {
        role: UserRole.admin,
      },
    });

    const totalPages = Math.ceil(totalMessagesCount / limit);

    const users = await this.prisma.user.findMany({
      where: {
        role: {
          in: [UserRole.admin],
        },
      },
      skip: offset,
      take: Number(limit),
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        emailConfirmed: true,
        api_key: true,
        phoneNumber: true,
        resetToken: true,
        currentHashedRefreshToken: true,
        createdAt: true,
        updatedAt: true,
        // Exclude password field
        password: false,
      },
    });

    return { totalPages, users };
  }
}
