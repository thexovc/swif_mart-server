import { PrismaService } from 'src/prisma.service';
import { UpdateUserDto } from './dto/user.dto';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    getUser(userId: string): Promise<{
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
    updateUser(userId: string, updateData: UpdateUserDto): Promise<{
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
    getAllUsers({ limit, page }: {
        limit: any;
        page: any;
    }): Promise<any>;
    getAllAdmins({ limit, page }: {
        limit: any;
        page: any;
    }): Promise<any>;
}
