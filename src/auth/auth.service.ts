import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

import { PrismaService } from 'src/prisma.service';
import {
  RegisterDto,
  comRegDto,
  createUserAdminDto,
  loginDto,
  resetDto,
} from './dto/auth.dto';
import { EmailsService } from 'src/emails/emails.service';
import { processEnv } from 'src/constants';
import { JwtPayload } from 'jsonwebtoken';
import { TokenExpiredError } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private readonly saltRounds = 10;
  private readonly secretKey = processEnv.jwt_secret;
  //   private readonly refreshSecret = process.env.REFRESH_SECRET;

  constructor(
    private prisma: PrismaService,
    private readonly emailsService: EmailsService,
  ) {}

  //   login
  async login(loginData: loginDto): Promise<any> {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        email: loginData.email.toLowerCase(),
      },
    });

    if (!existingUser) {
      throw new NotFoundException('Email is invalid');
    }

    const passwordMatch = await bcrypt.compare(
      loginData.password,
      existingUser.password,
    );

    if (!passwordMatch) {
      throw new HttpException('password incorrect', HttpStatus.UNAUTHORIZED);
    }

    if (!existingUser.emailConfirmed) {
      throw new HttpException('email not confirmed', HttpStatus.UNAUTHORIZED);
    }

    const access_token = jwt.sign(existingUser, this.secretKey, {
      expiresIn: '30m',
    });

    const { password, ...rest } = existingUser;

    return { access_token, data: rest };
  }

  //   register
  async register(createUserData: RegisterDto): Promise<any> {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        email: createUserData.email.toLowerCase(),
      },
    });

    if (existingUser) {
      throw new BadRequestException('Email already registered');
    }

    const { password, email, ...data } = createUserData;

    const hashedPassword = await bcrypt.hash(password, this.saltRounds);

    let api_key = this.generateUniqueApiKey();

    // Check if api_key already exists, if so, generate another one
    while (await this.apiKeyExists(api_key)) {
      api_key = this.generateUniqueApiKey();
    }

    const newUser = await this.prisma.user.create({
      data: {
        ...data,
        email: email.toLowerCase(),
        api_key,
        password: hashedPassword,
      },
    });

    // await this.emailsService.sendWelcomeEmail(newUser);
    await this.generateAndSendToken(newUser.email);

    return { message: 'registration successfull check email to confirm!' };
  }

  // verify token
  async verifyToken(token: string): Promise<any> {
    try {
      const decoded: JwtPayload = jwt.verify(
        token,
        this.secretKey,
      ) as JwtPayload;

      if (decoded && decoded.id) {
        const user = await this.prisma.user.findUnique({
          where: {
            id: decoded.id,
          },
        });

        if (user) {
          await this.prisma.user.update({
            where: {
              id: user.id,
            },
            data: {
              emailConfirmed: true,
            },
          });

          return { message: 'email confirmed successfully' };
        } else {
          throw new HttpException(
            'User not found',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      } else {
        throw new HttpException('Invalid token', HttpStatus.BAD_REQUEST);
      }
    } catch (error) {
      throw new HttpException('Invalid token', HttpStatus.BAD_REQUEST);
    }
  }

  // forgot password
  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const token = jwt.sign({ id: user.id }, this.secretKey, {
      expiresIn: '30m',
    });

    let forgotLink: string;

    if (user.role == 'user') {
      forgotLink = `${processEnv.web_url}/reset-password/${token}`;
    } else {
      forgotLink = `${processEnv.web_url}/admin/reset-password/${token}`;
    }

    this.emailsService.sendResetLink(user, email, forgotLink);
  }

  // reset password
  async resetPassword(resetData: resetDto): Promise<any> {
    try {
      const decoded: JwtPayload = jwt.verify(
        resetData.token,
        this.secretKey,
      ) as JwtPayload;

      if (decoded && decoded.id) {
        const user = await this.prisma.user.findUnique({
          where: { id: decoded.id },
        });

        const hashedPassword = await bcrypt.hash(
          resetData.password,
          this.saltRounds,
        );

        if (user) {
          await this.prisma.user.update({
            where: { id: user.id },
            data: {
              password: hashedPassword,
            },
          });

          this.emailsService.sendPasswordChanged(user, user.email);

          return { message: 'password reset successfully!' };
        } else {
          throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
      } else {
        throw new HttpException('invalid token', HttpStatus.NOT_ACCEPTABLE);
      }
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new HttpException('expired token', HttpStatus.UNAUTHORIZED); // Handle expired tokens
      }

      throw new HttpException(
        error.message || 'invalid token',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
  }

  // admin create user
  async adminCreateUser(data: createUserAdminDto): Promise<any> {
    try {
      const token = jwt.sign({ ...data }, this.secretKey, {
        expiresIn: '3d',
      });

      await this.emailsService.sendVerificationEmail(data, token);

      return {
        message: `Account created for ${data.email}`,
      };
    } catch (error) {
      console.log(error);
      throw new HttpException('Invalid token', HttpStatus.NOT_ACCEPTABLE);
    }
  }

  // user complete registration
  async completeRegistration(data: comRegDto): Promise<any> {
    // Validate JWT token
    const decodedToken: any = jwt.verify(data.token, this.secretKey);
    if (!decodedToken) {
      throw new NotFoundException('Invalid or expired token');
    }

    const { email, fullName, role } = decodedToken;

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      throw new BadRequestException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(data.password, this.saltRounds);

    let api_key = this.generateUniqueApiKey();

    // Check if api_key already exists, if so, generate another one
    while (await this.apiKeyExists(api_key)) {
      api_key = this.generateUniqueApiKey();
    }

    await this.prisma.user.create({
      data: {
        fullName,
        email,
        role,
        password: hashedPassword,
        emailConfirmed: true,
        api_key,
      },
    });

    // await this.mailService.sendRegistrationCompletedEmail(decodedToken);

    this.emailsService.sendDynamic(
      email,
      { fullName, password: data.password, email },
      'auth/addTeamMember.ejs',
      `Welcome to the Data Coupon!`,
    );

    return { message: 'registration successful check email to confirm!' };
  }

  private generateUniqueApiKey(): string {
    // Generate a unique API key
    return uuidv4();
  }

  private async apiKeyExists(api_key: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: {
        api_key,
      },
    });
    return !!user;
  }

  private async generateAndSendToken(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const token = jwt.sign({ id: user.id }, this.secretKey, {
      expiresIn: '1hr',
    });

    const confirmationLink = `${processEnv.web_url}/verification/${token}`;

    this.emailsService.sendConfirmEmail(user, confirmationLink);
  }
}
