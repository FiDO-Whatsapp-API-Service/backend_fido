"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageValidation = void 0;
const zod_1 = require("zod");
class MessageValidation {
}
exports.MessageValidation = MessageValidation;
MessageValidation.SEND = zod_1.z.object({
    message: zod_1.z.string(),
    phone: zod_1.z.string().min(1).max(20)
});
