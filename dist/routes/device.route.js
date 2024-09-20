"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deviceRouter = void 0;
const express_1 = __importDefault(require("express"));
const device_controller_1 = require("../controllers/device.controller");
// PREFIX --> /device
exports.deviceRouter = express_1.default.Router();
exports.deviceRouter.get("/", device_controller_1.DeviceController.getByUser);
exports.deviceRouter.post("/", device_controller_1.DeviceController.create);
exports.deviceRouter.delete("/:id", device_controller_1.DeviceController.destroy);
exports.deviceRouter.get("/:id/login", device_controller_1.DeviceController.login);
exports.deviceRouter.patch("/:id/token", device_controller_1.DeviceController.refreshToken);
