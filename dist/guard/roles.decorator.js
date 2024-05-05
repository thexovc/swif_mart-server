"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Roles = void 0;
const common_1 = require("@nestjs/common");
const defaultRoles = ['user', 'admin'];
const Roles = (...roles) => (0, common_1.SetMetadata)('roles', roles.length > 0 ? roles.map((role) => role.toLowerCase()) : defaultRoles);
exports.Roles = Roles;
//# sourceMappingURL=roles.decorator.js.map