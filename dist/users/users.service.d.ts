import { PrismaService } from 'src/prisma.service';
import { UpdatePasswordDto, UpdateUserDto } from './dto/user.dto';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    getUser(userId: string): Promise<{
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
    updateUser(userId: string, updateData: UpdateUserDto): Promise<{
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
    updatePassword(userId: string, UpdatePasswordDto: UpdatePasswordDto): Promise<{
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
    getAllUsers({ limit, page }: {
        limit: any;
        page: any;
    }): Promise<any>;
    getAllAdmins({ limit, page }: {
        limit: any;
        page: any;
    }): Promise<any>;
}
