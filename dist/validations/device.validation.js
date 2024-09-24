"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeviceValidation = void 0;
const zod_1 = require("zod");
class DeviceValidation {
}
exports.DeviceValidation = DeviceValidation;
DeviceValidation.CREATE = zod_1.z.object({
    name: zod_1.z.string().min(1).max(100),
});
DeviceValidation.MIDDLEWARE = zod_1.z.object({
    token: zod_1.z.string()
});
