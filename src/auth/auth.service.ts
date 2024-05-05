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

    if (existingUser.passCode != loginData.passCode) {
      throw new HttpException('passCode incorrect', HttpStatus.UNAUTHORIZED);
    }

    const access_token = jwt.sign(existingUser, this.secretKey, {
      expiresIn: '1h',
    });

    const uptUser = await this.prisma.user.update({
      where: { email: loginData.email },
      data: {
        emailConfirmed: true,
        passCode: '',
      },
    });

    this.emailsService.sendDynamic(
      [loginData.email],
      {
        passcode: loginData.passCode,
      },
      'auth/login.ejs',
      `Swift Mart Login Passcode`,
    );

    return { access_token, data: uptUser };
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

    const { email } = createUserData;

    const randCode = await this.generatePassCode();

    const newUser = await this.prisma.user.create({
      data: {
        email: email.toLowerCase(),
        passCode: String(randCode),
      },
    });

    this.emailsService.sendDynamic(
      [email],
      {
        passcode: randCode,
      },
      'auth/welcome.ejs',
      `Welcome to Swift Mart! Your Registration Passcode`,
    );

    return { message: 'registration successfull check email for passCode!' };
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

  // // reset password
  // async resetPassword(resetData: resetDto): Promise<any> {
  //   try {
  //     const decoded: JwtPayload = jwt.verify(
  //       resetData.token,
  //       this.secretKey,
  //     ) as JwtPayload;

  //     if (decoded && decoded.id) {
  //       const user = await this.prisma.user.findUnique({
  //         where: { id: decoded.id },
  //       });

  //       const hashedPassword = await bcrypt.hash(
  //         resetData.password,
  //         this.saltRounds,
  //       );

  //       if (user) {
  //         await this.prisma.user.update({
  //           where: { id: user.id },
  //           data: {
  //             password: hashedPassword,
  //           },
  //         });

  //         this.emailsService.sendPasswordChanged(user, user.email);

  //         return { message: 'password reset successfully!' };
  //       } else {
  //         throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  //       }
  //     } else {
  //       throw new HttpException('invalid token', HttpStatus.NOT_ACCEPTABLE);
  //     }
  //   } catch (error) {
  //     if (error instanceof TokenExpiredError) {
  //       throw new HttpException('expired token', HttpStatus.UNAUTHORIZED); // Handle expired tokens
  //     }

  //     throw new HttpException(
  //       error.message || 'invalid token',
  //       HttpStatus.NOT_ACCEPTABLE,
  //     );
  //   }
  // }

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

    let randCode = await this.generatePassCode();

    await this.prisma.user.create({
      data: {
        fullName,
        email,
        role,
        passCode: String(randCode),
        emailConfirmed: true,
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

  private async generatePassCode(): Promise<number> {
    return Math.floor(1000 + Math.random() * 9000);
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
