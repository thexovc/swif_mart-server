"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma_service_1 = require("../prisma.service");
const emails_service_1 = require("../emails/emails.service");
const constants_1 = require("../constants");
let AuthService = class AuthService {
    constructor(prisma, emailsService) {
        this.prisma = prisma;
        this.emailsService = emailsService;
        this.saltRounds = 10;
        this.secretKey = constants_1.processEnv.jwt_secret;
    }
    async login(loginData) {
        const existingUser = await this.prisma.user.findUnique({
            where: {
                email: loginData.email.toLowerCase(),
            },
        });
        console.log(existingUser);
        if (!existingUser) {
            throw new common_1.NotFoundException('Email is invalid');
        }
        const randCode = await this.generatePassCode();
        if (!loginData.passCode) {
            const uptUser = await this.prisma.user.update({
                where: { email: loginData.email },
                data: {
                    emailConfirmed: true,
                    passCode: String(randCode),
                },
            });
            this.emailsService.sendDynamic([loginData.email], {
                passcode: randCode,
            }, 'auth/login.ejs', `Swift Mart Login Passcode`);
            return { message: 'passCode sent' };
        }
        if (!existingUser.passCode) {
            throw new common_1.HttpException('Login to get passCode', common_1.HttpStatus.UNAUTHORIZED);
        }
        if (existingUser.passCode != loginData.passCode) {
            throw new common_1.HttpException('passCode incorrect', common_1.HttpStatus.UNAUTHORIZED);
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
        return { access_token, data: uptUser };
    }
    async register(createUserData) {
        const existingUser = await this.prisma.user.findUnique({
            where: {
                email: createUserData.email.toLowerCase(),
            },
        });
        if (existingUser) {
            throw new common_1.BadRequestException('Email already registered');
        }
        const { email } = createUserData;
        const randCode = await this.generatePassCode();
        const newUser = await this.prisma.user.create({
            data: {
                email: email.toLowerCase(),
                passCode: String(randCode),
            },
        });
        this.emailsService.sendDynamic([email], {
            passcode: randCode,
        }, 'auth/welcome.ejs', `Welcome to Swift Mart! Your Registration Passcode`);
        return { message: 'registration successfull check email for passCode!' };
    }
    async verifyToken(token) {
        try {
            const decoded = jwt.verify(token, this.secretKey);
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
                }
                else {
                    throw new common_1.HttpException('User not found', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
                }
            }
            else {
                throw new common_1.HttpException('Invalid token', common_1.HttpStatus.BAD_REQUEST);
            }
        }
        catch (error) {
            throw new common_1.HttpException('Invalid token', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async forgotPassword(email) {
        const user = await this.prisma.user.findUnique({
            where: { email: email.toLowerCase() },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const token = jwt.sign({ id: user.id }, this.secretKey, {
            expiresIn: '30m',
        });
        let forgotLink;
        if (user.role == 'user') {
            forgotLink = `${constants_1.processEnv.web_url}/reset-password/${token}`;
        }
        else {
            forgotLink = `${constants_1.processEnv.web_url}/admin/reset-password/${token}`;
        }
        this.emailsService.sendResetLink(user, email, forgotLink);
    }
    async adminCreateUser(data) {
        try {
            const token = jwt.sign({ ...data }, this.secretKey, {
                expiresIn: '3d',
            });
            await this.emailsService.sendVerificationEmail(data, token);
            return {
                message: `Account created for ${data.email}`,
            };
        }
        catch (error) {
            console.log(error);
            throw new common_1.HttpException('Invalid token', common_1.HttpStatus.NOT_ACCEPTABLE);
        }
    }
    async completeRegistration(data) {
        const decodedToken = jwt.verify(data.token, this.secretKey);
        if (!decodedToken) {
            throw new common_1.NotFoundException('Invalid or expired token');
        }
        const { email, fullName, role } = decodedToken;
        const existingUser = await this.prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            throw new common_1.BadRequestException('Email already registered');
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
        this.emailsService.sendDynamic(email, { fullName, password: data.password, email }, 'auth/addTeamMember.ejs', `Welcome to the Data Coupon!`);
        return { message: 'registration successful check email to confirm!' };
    }
    async generatePassCode() {
        return Math.floor(1000 + Math.random() * 9000);
    }
    async generateAndSendToken(email) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const token = jwt.sign({ id: user.id }, this.secretKey, {
            expiresIn: '1hr',
        });
        const confirmationLink = `${constants_1.processEnv.web_url}/verification/${token}`;
        this.emailsService.sendConfirmEmail(user, confirmationLink);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        emails_service_1.EmailsService])
], AuthService);
//# sourceMappingURL=auth.service.js.map