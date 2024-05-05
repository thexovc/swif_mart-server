import { PrismaService } from 'src/prisma.service';
export declare class StatisticsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getCouponAnalytics(userId: string): Promise<{
        totalCoupons: any;
        pendingCoupons: any;
        redeemedCoupons: any;
        expiredCoupons: any;
    }>;
}
