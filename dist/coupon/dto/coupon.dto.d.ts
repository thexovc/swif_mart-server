export declare class CreateCouponDto {
    productName: string;
    batchNumber?: string;
}
export declare class CreateBatchCouponDto {
    batchNumber: string;
    productName: string;
    expirationDate: Date;
    refNumbers: string[];
    couponPins: string[];
}
export declare class RedeemCouponDto {
    couponPin: string;
    phone: string;
}
export declare class GetCouponDto {
    couponPin: string;
}
