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
exports.UserService = void 0;
const bcrypt_1 = require("bcrypt");
const db_1 = require("../app/db");
const user_model_1 = require("../models/user.model");
const user_validation_1 = require("../validations/user.validation");
const validation_1 = require("../validations/validation");
const response_error_1 = require("../errors/response.error");
const verify_token_service_1 = require("./verify-token.service");
const notice_service_1 = require("./notice.service");
class UserService {
    static getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.prisma.user.findMany();
        });
    }
    static create(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const registerRequest = validation_1.Validation.validate(user_validation_1.UserValidation.REGISTER, request);
            const uniquePhone = yield db_1.prisma.user.findUnique({ where: { phone: registerRequest.phone } });
            if (uniquePhone) {
                throw new response_error_1.ResponseError(400, "phone_exists");
            }
            const password = yield (0, bcrypt_1.hash)(registerRequest.password, 10);
            const user = yield db_1.prisma.user.create({
                data: Object.assign(Object.assign({}, registerRequest), { username: registerRequest.phone, password })
            });
            // Get Verified status
            const verifyToken = yield verify_token_service_1.VerifyToken.getCodeByUserId(user.id);
            // Send Notification
            yield notice_service_1.NoticeService.create("Telah melakukan pendaftaran", user.id.toString());
            return (0, user_model_1.toUserResponse)(user, verifyToken.is_verified);
        });
    }
}
exports.UserService = UserService;
