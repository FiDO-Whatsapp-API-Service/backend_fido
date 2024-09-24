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
exports.UserController = void 0;
const user_service_1 = require("../services/user.service");
const auth_service_1 = require("../services/auth.service");
class UserController {
    static register(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const request = req.body;
                const response = yield user_service_1.UserService.create(request);
                res.status(201).json({
                    data: response,
                    errors: null,
                    message: "Create user successfully"
                });
            }
            catch (e) {
                next(e);
            }
        });
    }
    static getUsers(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield user_service_1.UserService.getAll();
                res.status(200).json({
                    data: response,
                    errors: null,
                    message: "Get all data user successfully"
                });
            }
            catch (e) {
                next(e);
            }
        });
    }
    static updateUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const request = req.body;
                const updateUser = yield user_service_1.UserService.updateProfile(request, user.id);
                const response = auth_service_1.AuthService.generateSession(updateUser);
                res.status(201).json({
                    errors: null,
                    message: "Update user successfully",
                    data: response,
                });
            }
            catch (e) {
                next(e);
            }
        });
    }
    static setRole(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const request = req.body;
                const response = yield user_service_1.UserService.updateRole(request);
                res.status(201).send({
                    errors: null,
                    message: "Update role successfully",
                    data: response
                });
            }
            catch (e) {
                next(e);
            }
        });
    }
}
exports.UserController = UserController;
