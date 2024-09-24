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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcrypt_1 = require("bcrypt");
const db_1 = require("../app/db");
const response_error_1 = require("../errors/response.error");
const validation_1 = require("../validations/validation");
const user_validation_1 = require("../validations/user.validation");
const auth_model_1 = require("../models/auth.model");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = require("../models/user.model");
const verify_token_service_1 = require("./verify-token.service");
class AuthService {
    static login(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const loginReq = validation_1.Validation.validate(user_validation_1.UserValidation.LOGIN, req);
            const user = yield db_1.prisma.user.findFirst({
                where: {
                    OR: [{ username: loginReq.username }, { phone: loginReq.username }]
                }
            });
            if (user && (yield (0, bcrypt_1.compare)(loginReq.password, user.password))) {
                let isVerified = false;
                if (user.phone === "admin") {
                    isVerified = true;
                }
                else {
                    const verifyToken = yield verify_token_service_1.VerifyToken.getCodeByUserId(user.id);
                    isVerified = verifyToken.is_verified;
                }
                const userResponse = (0, user_model_1.toUserResponse)(user, isVerified);
                return this.generateSession(userResponse);
            }
            throw new response_error_1.ResponseError(400, "wrong_credentials");
        });
    }
    static updateVerified(user) {
        const verifiedUser = Object.assign(Object.assign({}, user), { isVerified: true });
        const token = jsonwebtoken_1.default.sign(verifiedUser, process.env.JWT_SECRET);
        return (0, auth_model_1.toSessionResponse)(verifiedUser, token);
    }
    static generateSession(user) {
        const token = jsonwebtoken_1.default.sign(user, process.env.JWT_SECRET, { expiresIn: "1h" });
        return (0, auth_model_1.toSessionResponse)(user, token);
    }
}
exports.AuthService = AuthService;
