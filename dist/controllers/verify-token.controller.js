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
exports.VerifyTokenController = void 0;
const verify_token_service_1 = require("../services/verify-token.service");
const auth_service_1 = require("../services/auth.service");
class VerifyTokenController {
    static verify(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const request = req.body;
                yield verify_token_service_1.VerifyToken.updateStatus(request, user.id);
                const response = auth_service_1.AuthService.updateVerified(user);
                res.status(201).send({
                    errors: null,
                    message: "Verify token successfully",
                    data: response
                });
            }
            catch (e) {
                next(e);
            }
        });
    }
}
exports.VerifyTokenController = VerifyTokenController;
