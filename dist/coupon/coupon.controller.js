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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CouponController = void 0;
const common_1 = require("@nestjs/common");
const coupon_service_1 = require("./coupon.service");
const coupon_dto_1 = require("./dto/coupon.dto");
const auth_guard_1 = require("../guard/auth.guard");
const roles_decorator_1 = require("../guard/roles.decorator");
let CouponController = class CouponController {
    constructor(couponService) {
        this.couponService = couponService;
    }
    async getCoupon(couponPin) {
        return await this.couponService.getCoupon(couponPin);
    }
    async createCoupon(createCouponDto, req) {
        const createdCoupon = await this.couponService.createCoupon(createCouponDto, req.user.id);
        return {
            message: 'Coupon created successfully',
            data: createdCoupon,
        };
    }
    async createBatchCoupons(createBatchCouponDto, req) {
        const createdCoupons = await this.couponService.createBatchCoupons(createBatchCouponDto, req.user.id);
        return {
            message: 'Batch of coupons created successfully',
            data: createdCoupons,
        };
    }
    async redeemCoupon(redeemCouponDto) {
        const redeemedCoupon = await this.couponService.redeemCoupon(redeemCouponDto);
        return {
            message: 'Coupon redeemed successfully',
            data: redeemedCoupon,
        };
    }
};
exports.CouponController = CouponController;
__decorate([
    (0, common_1.Get)(':couponPin'),
    __param(0, (0, common_1.Param)('couponPin')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CouponController.prototype, "getCoupon", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, roles_decorator_1.Roles)(),
    (0, common_1.Post)('create'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [coupon_dto_1.CreateCouponDto, Object]),
    __metadata("design:returntype", Promise)
], CouponController.prototype, "createCoupon", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, roles_decorator_1.Roles)(),
    (0, common_1.Post)('create-batch'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [coupon_dto_1.CreateBatchCouponDto, Object]),
    __metadata("design:returntype", Promise)
], CouponController.prototype, "createBatchCoupons", null);
__decorate([
    (0, common_1.Put)('redeem'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [coupon_dto_1.RedeemCouponDto]),
    __metadata("design:returntype", Promise)
], CouponController.prototype, "redeemCoupon", null);
exports.CouponController = CouponController = __decorate([
    (0, common_1.Controller)('api/coupon'),
    __metadata("design:paramtypes", [coupon_service_1.CouponService])
], CouponController);
//# sourceMappingURL=coupon.controller.js.map