import { PrismaService } from 'src/prisma.service';
import { RegisterDto, comRegDto, createUserAdminDto, loginDto } from './dto/auth.dto';
import { EmailsService } from 'src/emails/emails.service';
export declare class AuthService {
    private prisma;
    private readonly emailsService;
    private readonly saltRounds;
    private readonly secretKey;
    constructor(prisma: PrismaService, emailsService: EmailsService);
    login(loginData: loginDto): Promise<any>;
    register(createUserData: RegisterDto): Promise<any>;
    verifyToken(token: string): Promise<any>;
    forgotPassword(email: string): Promise<void>;
    adminCreateUser(data: createUserAdminDto): Promise<any>;
    completeRegistration(data: comRegDto): Promise<any>;
    private generatePassCode;
    private generateAndSendToken;
}
