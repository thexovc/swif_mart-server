"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CouponService = void 0;
const crypto_1 = require("crypto");
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const client_1 = require("@prisma/client");
const allocate_utils_1 = require("./utils/allocate.utils");
let CouponService = class CouponService {
    constructor(prisma, allocateUtils) {
        this.prisma = prisma;
        this.allocateUtils = allocateUtils;
    }
    async getCoupon(couponPin) {
        return await this.prisma.coupon.findFirst({
            where: { couponPin },
        });
    }
    async createCoupon(createCouponDto, userId) {
        const uniquePin = await this.generateUniqueCouponPin();
        const expirationDate = new Date();
        expirationDate.setMonth(expirationDate.getMonth() + 3);
        const newCoupon = {
            couponPin: uniquePin,
            productName: createCouponDto.productName,
            expirationDate,
            couponUsage: client_1.couponUsage.single,
            userId,
        };
        return await this.prisma.coupon.create({
            data: newCoupon,
        });
    }
    async createBatchCoupons(createBatchCouponDto, userId) {
        const latestBatch = await this.prisma.batch.findFirst({
            orderBy: {
                batchNumber: 'desc',
            },
        });
        let newBatchNumber = '0001';
        if (latestBatch && latestBatch.batchNumber) {
            const currentBatchNumber = parseInt(latestBatch.batchNumber, 10);
            newBatchNumber = String(currentBatchNumber + 1).padStart(4, '0');
        }
        const { productName, expirationDate, couponPins } = createBatchCouponDto;
        const newCoupons = [];
        for (const coupon of couponPins) {
            const uniquePin = await this.generateUniqueCouponPin();
            const newCoupon = {
                couponPin: uniquePin,
                couponUsage: 'single',
                productName,
                expirationDate,
                status: client_1.couponUsage.single,
                batchNumber: newBatchNumber,
                userId,
            };
            newCoupons.push(newCoupon);
        }
        return await this.prisma.coupon.createMany({
            data: newCoupons,
        });
    }
    async redeemCoupon(redeemCouponDto) {
        const { couponPin, phone } = redeemCouponDto;
        const coupon = await this.prisma.coupon.findFirst({
            where: { couponPin },
        });
        if (!coupon) {
            throw new common_1.NotFoundException('Coupon not found');
        }
        if (coupon.status !== 'pending') {
            throw new common_1.BadRequestException('Coupon cannot be redeemed');
        }
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
        if (coupon.generatedAt < threeMonthsAgo) {
            throw new common_1.BadRequestException('Coupon has expired');
        }
        await this.allocateUtils.redeemDataWisper(redeemCouponDto.couponPin, redeemCouponDto.phone, coupon.productName);
        return await this.prisma.coupon.update({
            where: {
                couponPin: couponPin,
            },
            data: {
                redeemedBy: phone,
                status: client_1.CouponStatus.redeemed,
                redeemedDate: new Date(),
            },
        });
    }
    async generateUniqueCouponPin() {
        const maxAttempts = 5;
        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            const uniquePin = (0, crypto_1.randomBytes)(6).toString('hex');
            const existingCoupon = await this.prisma.coupon.findFirst({
                where: { couponPin: uniquePin },
            });
            if (!existingCoupon) {
                return uniquePin;
            }
        }
        throw new Error('Could not generate a unique coupon pin after several attempts');
    }
};
exports.CouponService = CouponService;
exports.CouponService = CouponService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        allocate_utils_1.AllocateUtils])
], CouponService);
//# sourceMappingURL=coupon.service.js.map