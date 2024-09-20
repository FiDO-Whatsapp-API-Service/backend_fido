"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyToken = void 0;
const db_1 = require("../app/db");
const response_error_1 = require("../errors/response.error");
const validation_1 = require("../validations/validation");
const user_validation_1 = require("../validations/user.validation");
class VerifyToken {
    static create(user_id, code) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield db_1.prisma.verifiedCode.create({ data: { user_id, code } });
            }
            catch (e) {
                throw new Error("Failed to create verified code: " + e.message);
            }
        });
    }
    static getCodeByUserId(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const otp = yield db_1.prisma.verifiedCode.findFirst({ where: { user_id } });
                if (!otp) {
                    return yield db_1.prisma.verifiedCode.create({ data: { user_id, code: Math.floor(1000 + Math.random() * 9000) } });
                }
                return otp;
            }
            catch (e) {
                throw new Error("Failed to get code: " + e.message);
            }
        });
    }
    static updateStatus(req, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const verifyReq = validation_1.Validation.validate(user_validation_1.UserValidation.VERIFY_CODE, req);
            try {
                yield db_1.prisma.verifiedCode.findFirst({ where: { user_id, code: verifyReq.otp } });
                return yield db_1.prisma.verifiedCode.update({ where: { user_id, code: verifyReq.otp }, data: { is_verified: true } });
            }
            catch (e) {
                throw new response_error_1.ResponseError(400, "wrong_otp");
            }
        });
    }
}
exports.VerifyToken = VerifyToken;
