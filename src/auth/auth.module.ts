import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/prisma.service';
import { EmailsService } from 'src/emails/emails.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, PrismaService, EmailsService],
})
export class AuthModule {}
