import { PrismaService } from 'src/prisma.service';
import { CreateCouponDto, CreateBatchCouponDto, RedeemCouponDto } from './dto/coupon.dto';
import { AllocateUtils } from './utils/allocate.utils';
export declare class CouponService {
    private readonly prisma;
    private readonly allocateUtils;
    constructor(prisma: PrismaService, allocateUtils: AllocateUtils);
    getCoupon(couponPin: string): Promise<{
        id: string;
        couponPin: string;
        couponUsage: import(".prisma/client").$Enums.couponUsage;
        status: import(".prisma/client").$Enums.CouponStatus;
        generatedAt: Date;
        expirationDate: Date;
        productName: string;
        batchNumber: string;
        redeemedBy: string;
        redeemedDate: Date;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        batchId: string;
    }>;
    createCoupon(createCouponDto: CreateCouponDto, userId: string): Promise<{
        id: string;
        couponPin: string;
        couponUsage: import(".prisma/client").$Enums.couponUsage;
        status: import(".prisma/client").$Enums.CouponStatus;
        generatedAt: Date;
        expirationDate: Date;
        productName: string;
        batchNumber: string;
        redeemedBy: string;
        redeemedDate: Date;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        batchId: string;
    }>;
    createBatchCoupons(createBatchCouponDto: CreateBatchCouponDto, userId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
    redeemCoupon(redeemCouponDto: RedeemCouponDto): Promise<{
        id: string;
        couponPin: string;
        couponUsage: import(".prisma/client").$Enums.couponUsage;
        status: import(".prisma/client").$Enums.CouponStatus;
        generatedAt: Date;
        expirationDate: Date;
        productName: string;
        batchNumber: string;
        redeemedBy: string;
        redeemedDate: Date;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        batchId: string;
    }>;
    private generateUniqueCouponPin;
}
