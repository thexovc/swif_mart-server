import { UsersService } from './users.service';
import { UpdatePasswordDto, UpdateUserDto } from './dto/user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getUser(req: any): Promise<{
        id: string;
        fullName: string;
        email: string;
        passCode: string;
        role: import(".prisma/client").$Enums.UserRole;
        emailConfirmed: boolean;
        api_key: string;
        phoneNumber: string;
        resetToken: string;
        currentHashedRefreshToken: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    adminGetUser(id: any): Promise<{
        id: string;
        fullName: string;
        email: string;
        passCode: string;
        role: import(".prisma/client").$Enums.UserRole;
        emailConfirmed: boolean;
        api_key: string;
        phoneNumber: string;
        resetToken: string;
        currentHashedRefreshToken: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateUser(req: any, UpdateUserDto: UpdateUserDto): Promise<{
        id: string;
        fullName: string;
        email: string;
        passCode: string;
        role: import(".prisma/client").$Enums.UserRole;
        emailConfirmed: boolean;
        api_key: string;
        phoneNumber: string;
        resetToken: string;
        currentHashedRefreshToken: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    adminUpdateUser(id: any, UpdateUserDto: UpdateUserDto): Promise<{
        id: string;
        fullName: string;
        email: string;
        passCode: string;
        role: import(".prisma/client").$Enums.UserRole;
        emailConfirmed: boolean;
        api_key: string;
        phoneNumber: string;
        resetToken: string;
        currentHashedRefreshToken: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    changePassword(req: any, UpdatePasswordDto: UpdatePasswordDto): Promise<{
        id: string;
        fullName: string;
        email: string;
        passCode: string;
        role: import(".prisma/client").$Enums.UserRole;
        emailConfirmed: boolean;
        api_key: string;
        phoneNumber: string;
        resetToken: string;
        currentHashedRefreshToken: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getAllUsers(limit?: number, page?: number): Promise<any>;
    getAllAdmins(limit?: number, page?: number): Promise<any>;
}
