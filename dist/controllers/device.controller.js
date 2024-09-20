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
exports.DeviceController = void 0;
const device_service_1 = require("../services/device.service");
const waService_1 = require("../app/waService");
const device_token_service_1 = require("../services/device-token.service");
const response_error_1 = require("../errors/response.error");
class DeviceController {
    static getByUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const response = yield device_service_1.DeviceService.getByUser(user.id);
                return res.status(200).json({
                    data: response
                });
            }
            catch (e) {
                next(e);
            }
        });
    }
    static create(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const request = req.body;
                const newDevice = yield device_service_1.DeviceService.create(request, user.id);
                (0, waService_1.createSessionWhatsapp)(newDevice.id.toString(), newDevice.name, user.id);
                return res.status(201).json({
                    data: newDevice
                });
            }
            catch (e) {
                next(e);
            }
        });
    }
    static login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const device = yield device_service_1.DeviceService.getById(parseInt(id));
                if (device) {
                    (0, waService_1.createSessionWhatsapp)(id.toString(), device.name, device.user_id);
                    res.status(201).json({
                        errors: null,
                        message: "Waiting authentication"
                    });
                }
                else {
                    throw new response_error_1.ResponseError(404, "Device not found");
                }
            }
            catch (e) {
                next(e);
            }
        });
    }
    static refreshToken(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const response = yield device_token_service_1.DeviceTokenService.updateToken(parseInt(id));
                return res.status(200).json({
                    errors: null,
                    message: "Refresh token successfully",
                    data: response
                });
            }
            catch (e) {
                next(e);
            }
        });
    }
    static destroy(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                yield device_service_1.DeviceService.destroy(parseInt(id));
                return res.status(202).json({
                    errors: null,
                    message: "Device deleted successfully",
                });
            }
            catch (e) {
                next(e);
            }
        });
    }
}
exports.DeviceController = DeviceController;
