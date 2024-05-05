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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const bcrypt = require("bcryptjs");
const client_1 = require("@prisma/client");
let UsersService = class UsersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getUser(userId) {
        try {
            return await this.prisma.user.findUnique({
                where: {
                    id: userId,
                },
                select: {
                    id: true,
                    fullName: true,
                    email: true,
                    role: true,
                    emailConfirmed: true,
                    api_key: true,
                    phoneNumber: true,
                    resetToken: true,
                    currentHashedRefreshToken: true,
                    createdAt: true,
                    updatedAt: true,
                    password: false,
                },
            });
        }
        catch (error) {
            throw new common_1.HttpException('No user found', common_1.HttpStatus.NOT_FOUND);
        }
    }
    async updateUser(userId, updateData) {
        return await this.prisma.user.update({
            where: {
                id: userId,
            },
            data: updateData,
            select: {
                id: true,
                fullName: true,
                email: true,
                role: true,
                emailConfirmed: true,
                api_key: true,
                phoneNumber: true,
                resetToken: true,
                currentHashedRefreshToken: true,
                createdAt: true,
                updatedAt: true,
                password: false,
            },
        });
    }
    async updatePassword(userId, UpdatePasswordDto) {
        if (UpdatePasswordDto.password != UpdatePasswordDto.confirmPassword) {
            throw new common_1.HttpException('Password does not match', common_1.HttpStatus.BAD_REQUEST);
        }
        const hashedPassword = await bcrypt.hash(UpdatePasswordDto.password, 10);
        return await this.prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                password: hashedPassword,
            },
            select: {
                id: true,
                fullName: true,
                email: true,
                role: true,
                emailConfirmed: true,
                api_key: true,
                phoneNumber: true,
                resetToken: true,
                currentHashedRefreshToken: true,
                createdAt: true,
                updatedAt: true,
                password: false,
            },
        });
    }
    async getAllUsers({ limit, page }) {
        const offset = Number(limit) * (Number(page) - 1);
        const totalMessagesCount = await this.prisma.user.count({
            where: {
                role: client_1.UserRole.user,
            },
        });
        const totalPages = Math.ceil(totalMessagesCount / limit);
        const users = await this.prisma.user.findMany({
            where: {
                role: client_1.UserRole.user,
            },
            skip: offset,
            take: Number(limit),
            select: {
                id: true,
                fullName: true,
                email: true,
                role: true,
                emailConfirmed: true,
                api_key: true,
                phoneNumber: true,
                resetToken: true,
                currentHashedRefreshToken: true,
                createdAt: true,
                updatedAt: true,
                password: false,
            },
        });
        return { totalPages, users };
    }
    async getAllAdmins({ limit, page }) {
        const offset = Number(limit) * (Number(page) - 1);
        const totalMessagesCount = await this.prisma.user.count({
            where: {
                role: client_1.UserRole.admin,
            },
        });
        const totalPages = Math.ceil(totalMessagesCount / limit);
        const users = await this.prisma.user.findMany({
            where: {
                role: {
                    in: [client_1.UserRole.admin],
                },
            },
            skip: offset,
            take: Number(limit),
            select: {
                id: true,
                fullName: true,
                email: true,
                role: true,
                emailConfirmed: true,
                api_key: true,
                phoneNumber: true,
                resetToken: true,
                currentHashedRefreshToken: true,
                createdAt: true,
                updatedAt: true,
                password: false,
            },
        });
        return { totalPages, users };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map