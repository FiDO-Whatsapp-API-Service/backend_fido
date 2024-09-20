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
exports.DeviceTokenService = void 0;
const db_1 = require("../app/db");
const crypto_1 = __importDefault(require("crypto"));
const notice_service_1 = require("./notice.service");
const device_service_1 = require("./device.service");
class DeviceTokenService {
    static getSessionId(token) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            return (_b = (_a = (yield db_1.prisma.deviceToken.findUnique({ where: { token } }))) === null || _a === void 0 ? void 0 : _a.device_id) !== null && _b !== void 0 ? _b : null;
        });
    }
    static createToken(device_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = crypto_1.default.randomBytes(32).toString('hex');
            const newDeviceToken = yield db_1.prisma.deviceToken.create({ data: { token, device_id } });
            return newDeviceToken;
        });
    }
    static updateToken(device_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = crypto_1.default.randomBytes(32).toString('hex');
                const result = yield db_1.prisma.deviceToken.update({ where: { device_id }, data: { token } });
                const device = yield device_service_1.DeviceService.getById(device_id);
                if (device) {
                    yield notice_service_1.NoticeService.create(`Telah melakukan refresh token pada device "${device.name}"`, device.user_id.toString());
                }
                return result;
            }
            catch (e) {
                throw new Error("Failed Refresh Token" + e.message);
            }
        });
    }
}
exports.DeviceTokenService = DeviceTokenService;
