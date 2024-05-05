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
exports.AllocateUtils = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
const constants_1 = require("../../constants");
const prisma_service_1 = require("../../prisma.service");
const network_1 = require("./network");
let AllocateUtils = class AllocateUtils {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getNetwork(phoneNumber) {
        if (!phoneNumber) {
            return undefined;
        }
        for (const network of network_1.networksJson) {
            if (network.prefixes.includes(phoneNumber.substring(0, 4))) {
                return network.name;
            }
        }
        return undefined;
    }
    async redeemDataWisper(couponPin, phone, size) {
        const networkMap = await this.getNetwork(phone);
        const { error, plan_id } = (0, network_1.glo_wisper_size_map)(size);
        console.log({ error, plan_id });
        if (error) {
            throw new common_1.HttpException('plan size is supported', common_1.HttpStatus.BAD_REQUEST);
        }
        let createdAllocation;
        if (networkMap != 'glo') {
            throw new common_1.HttpException('Phone number network is not glo', common_1.HttpStatus.FORBIDDEN);
        }
        let bodyData = JSON.stringify({
            network: 'glo',
            plan_id: plan_id,
            phone_number: phone,
        });
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${constants_1.processEnv.wisper_url}/api/buy`,
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': `${constants_1.processEnv.wisper_api_key}`,
            },
            data: bodyData,
        };
        await (0, axios_1.default)(config)
            .then(async (response) => {
            return response.data;
        })
            .catch(async (error) => {
            throw new common_1.HttpException(error?.response?.data?.message || error.message, error?.response?.status || common_1.HttpStatus.BAD_GATEWAY);
        });
        return createdAllocation;
    }
};
exports.AllocateUtils = AllocateUtils;
exports.AllocateUtils = AllocateUtils = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AllocateUtils);
//# sourceMappingURL=allocate.utils.js.map