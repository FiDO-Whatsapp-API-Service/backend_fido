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
exports.DeviceService = void 0;
const db_1 = require("../app/db");
const device_token_service_1 = require("./device-token.service");
const waService_1 = require("../app/waService");
const validation_1 = require("../validations/validation");
const device_validation_1 = require("../validations/device.validation");
class DeviceService {
    static getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.prisma.device.findMany();
        });
    }
    static getAllConnected() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.prisma.device.findMany({ where: { is_connected: true } });
        });
    }
    static create(req, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const registerRequest = validation_1.Validation.validate(device_validation_1.DeviceValidation.CREATE, req);
            try {
                const device = yield db_1.prisma.device.create({
                    data: { name: req.name, user_id }
                });
                // GENERATE TOKEN
                yield device_token_service_1.DeviceTokenService.createToken(device.id);
                return device;
            }
            catch (e) {
                throw new Error("Failed to create device: " + e.message);
            }
        });
    }
    static getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.prisma.device.findUnique({ where: { id } });
        });
    }
    static checkIdIsExists(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return ((yield db_1.prisma.device.findUnique({ where: { id } })) !== null);
        });
    }
    static getByUser(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const devices = yield db_1.prisma.device.findMany({ where: { user_id }, include: { device_token: true } });
                return devices;
            }
            catch (e) {
                throw new Error("Failed to get devices: " + e.message);
            }
        });
    }
    static destroy(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const device = yield db_1.prisma.device.delete({ where: { id } });
                (0, waService_1.deleteSession)(id.toString(), device.is_connected);
            }
            catch (e) {
                throw new Error("Failed to delete device: " + e.message);
            }
        });
    }
    static updateConnectionStatus(id, is_connected, phone) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (phone) {
                    yield db_1.prisma.device.updateMany({ where: { id }, data: { is_connected, phone } });
                }
                else
                    [
                        yield db_1.prisma.device.updateMany({ where: { id }, data: { is_connected } })
                    ];
            }
            catch (e) {
                throw new Error("Failed to set device disconnected: " + e.message);
            }
        });
    }
}
exports.DeviceService = DeviceService;
