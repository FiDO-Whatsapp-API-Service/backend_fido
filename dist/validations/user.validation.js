"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidation = void 0;
const zod_1 = require("zod");
class UserValidation {
}
exports.UserValidation = UserValidation;
UserValidation.REGISTER = zod_1.z.object({
    phone: zod_1.z.string().min(1).max(20),
    name: zod_1.z.string().min(1).max(100),
    password: zod_1.z.string().min(1).max(100)
});
UserValidation.LOGIN = zod_1.z.object({
    username: zod_1.z.string().min(1).max(20),
    password: zod_1.z.string().min(1).max(100)
});
UserValidation.VERIFY_CODE = zod_1.z.object({
    otp: zod_1.z.number(),
});
UserValidation.UPDATE = zod_1.z.object({
    username: zod_1.z.string().min(1).max(20),
    name: zod_1.z.string().min(1).max(100),
    email: zod_1.z.string().email().nullable().optional()
});
UserValidation.SET_ROLE = zod_1.z.object({
    id: zod_1.z.number(),
    role: zod_1.z.enum(['admin', 'user'])
});
