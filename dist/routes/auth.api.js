"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authtenticatedRouter = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
exports.authtenticatedRouter = express_1.default.Router();
exports.authtenticatedRouter.use(auth_middleware_1.authMiddleware);
exports.authtenticatedRouter.get("/users", user_controller_1.UserController.getUsers);
