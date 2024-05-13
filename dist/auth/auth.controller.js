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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const auth_dto_1 = require("./dto/auth.dto");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async login(loginData) {
        try {
            const res = await this.authService.login(loginData);
            return res;
        }
        catch (error) {
            console.log({ error });
            throw error;
        }
    }
    async verifyConfirmationToken(token) {
        try {
            const res = await this.authService.verifyToken(token);
            return res;
        }
        catch (error) {
            console.log({ error });
            throw error;
        }
    }
    async forgotPassword(forgotData) {
        try {
            await this.authService.forgotPassword(forgotData.email);
            return { message: 'forgot password email sent!' };
        }
        catch (error) {
            console.log({ error });
            throw error;
        }
    }
    async createUserAdmin(data) {
        try {
            const res = await this.authService.adminCreateUser(data);
            return res;
        }
        catch (error) {
            console.log({ error });
            throw error;
        }
    }
    async completeRegistration(data) {
        try {
            const res = await this.authService.completeRegistration(data);
            return res;
        }
        catch (error) {
            console.log({ error });
            throw error;
        }
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)(new common_1.ValidationPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.loginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Get)('verify/:token'),
    __param(0, (0, common_1.Param)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyConfirmationToken", null);
__decorate([
    (0, common_1.Post)('forgotPassword'),
    __param(0, (0, common_1.Body)(new common_1.ValidationPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.forgotDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "forgotPassword", null);
__decorate([
    (0, common_1.Post)('createUserAdmin'),
    __param(0, (0, common_1.Body)(new common_1.ValidationPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.createUserAdminDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "createUserAdmin", null);
__decorate([
    (0, common_1.Post)('completeRegistration'),
    __param(0, (0, common_1.Body)(new common_1.ValidationPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.comRegDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "completeRegistration", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('api/auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map