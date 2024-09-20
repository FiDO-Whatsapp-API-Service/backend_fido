"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiRouter = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const auth_controller_1 = require("../controllers/auth.controller");
const verify_token_controller_1 = require("../controllers/verify-token.controller");
const device_route_1 = require("./device.route");
const message_route_1 = require("./message.route");
const notice_controller_1 = require("../controllers/notice.controller");
exports.apiRouter = express_1.default.Router();
exports.apiRouter.use(auth_middleware_1.authMiddleware);
exports.apiRouter.get("/session", auth_controller_1.AuthController.getSession);
exports.apiRouter.get("/users", user_controller_1.UserController.getUsers);
exports.apiRouter.post("/verify-otp", verify_token_controller_1.VerifyTokenController.verify);
exports.apiRouter.get('/notice', notice_controller_1.NoticeController.index);
// Device Router
exports.apiRouter.use('/device', device_route_1.deviceRouter);
// Message Router
exports.apiRouter.use('/message', message_route_1.messageRouter);
