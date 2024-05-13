import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getUser(req: any): Promise<{
        email: string;
        fullName: string;
        role: import(".prisma/client").$Enums.UserRole;
        id: string;
        emailConfirmed: boolean;
        phoneNumber: string;
        resetToken: string;
        currentHashedRefreshToken: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    adminGetUser(id: any): Promise<{
        email: string;
        fullName: string;
        role: import(".prisma/client").$Enums.UserRole;
        id: string;
        emailConfirmed: boolean;
        phoneNumber: string;
        resetToken: string;
        currentHashedRefreshToken: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateUser(req: any, UpdateUserDto: UpdateUserDto): Promise<{
        email: string;
        fullName: string;
        role: import(".prisma/client").$Enums.UserRole;
        id: string;
        emailConfirmed: boolean;
        phoneNumber: string;
        resetToken: string;
        currentHashedRefreshToken: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    adminUpdateUser(id: any, UpdateUserDto: UpdateUserDto): Promise<{
        email: string;
        fullName: string;
        role: import(".prisma/client").$Enums.UserRole;
        id: string;
        emailConfirmed: boolean;
        phoneNumber: string;
        resetToken: string;
        currentHashedRefreshToken: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getAllUsers(limit?: number, page?: number): Promise<any>;
    getAllAdmins(limit?: number, page?: number): Promise<any>;
}
