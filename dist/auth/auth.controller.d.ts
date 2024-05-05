import { AuthService } from './auth.service';
import { RegisterDto, comRegDto, createUserAdminDto, forgotDto, loginDto } from './dto/auth.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<any>;
    login(loginData: loginDto): Promise<any>;
    verifyConfirmationToken(token: string): Promise<any>;
    forgotPassword(forgotData: forgotDto): Promise<{
        message: string;
    }>;
    createUserAdmin(data: createUserAdminDto): Promise<any>;
    completeRegistration(data: comRegDto): Promise<any>;
}
