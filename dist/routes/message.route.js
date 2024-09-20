"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageRouter = void 0;
const express_1 = __importDefault(require("express"));
const message_controller_1 = require("../controllers/message.controller");
exports.messageRouter = express_1.default.Router();
exports.messageRouter.post("/:id/send", message_controller_1.MessageController.sendMessage);
