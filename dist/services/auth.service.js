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
            const user = yield db_1.prisma.user.findUnique({ where: { phone: loginReq.phone } });
            if (user && (yield (0, bcrypt_1.compare)(loginReq.password, user.password))) {
                const verifyToken = yield verify_token_service_1.VerifyToken.getCodeByUserId(user.id);
                const userResponse = (0, user_model_1.toUserResponse)(user, verifyToken.is_verified);
                const token = jsonwebtoken_1.default.sign(Object.assign(Object.assign({}, userResponse), { isVerified: verifyToken.is_verified }), process.env.JWT_SECRET);
                return (0, auth_model_1.toLoginResponse)(userResponse, token);
            }
            throw new response_error_1.ResponseError(400, "wrong_credentials");
        });
    }
    static updateVerified(user) {
        const verifiedUser = Object.assign(Object.assign({}, user), { isVerified: true });
        const token = jsonwebtoken_1.default.sign(verifiedUser, process.env.JWT_SECRET);
        return (0, auth_model_1.toLoginResponse)(verifiedUser, token);
    }
}
exports.AuthService = AuthService;
