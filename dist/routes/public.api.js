"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.publicRouter = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const auth_controller_1 = require("../controllers/auth.controller");
const message_controller_1 = require("../controllers/message.controller");
exports.publicRouter = express_1.default.Router();
exports.publicRouter.post("/users", user_controller_1.UserController.register);
exports.publicRouter.post("/login", auth_controller_1.AuthController.login);
// Send Message With Token
exports.publicRouter.post("/public/message/send", message_controller_1.MessageController.sendMessageWithToken);
