import { PrismaService } from 'src/prisma.service';
export declare class AllocateUtils {
    private prisma;
    constructor(prisma: PrismaService);
    getNetwork(phoneNumber: string): Promise<string | undefined>;
    redeemDataWisper(couponPin: string, phone: string, size: string): Promise<any>;
}
