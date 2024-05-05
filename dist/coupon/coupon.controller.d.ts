import { CouponService } from './coupon.service';
import { CreateCouponDto, CreateBatchCouponDto, RedeemCouponDto } from './dto/coupon.dto';
export declare class CouponController {
    private readonly couponService;
    constructor(couponService: CouponService);
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
    createCoupon(createCouponDto: CreateCouponDto, req: any): Promise<{
        message: string;
        data: {
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
        };
    }>;
    createBatchCoupons(createBatchCouponDto: CreateBatchCouponDto, req: any): Promise<{
        message: string;
        data: import(".prisma/client").Prisma.BatchPayload;
    }>;
    redeemCoupon(redeemCouponDto: RedeemCouponDto): Promise<{
        message: string;
        data: {
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
        };
    }>;
}
