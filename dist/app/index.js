"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = exports.server = exports.web = void 0;
const express_1 = __importDefault(require("express"));
const public_api_1 = require("../routes/public.api");
const error_middleware_1 = require("../middlewares/error.middleware");
const api_1 = require("../routes/api");
const http_1 = require("http");
const cors_1 = __importDefault(require("cors"));
const socket_io_1 = require("socket.io");
exports.web = (0, express_1.default)();
exports.server = (0, http_1.createServer)(exports.web);
exports.io = new socket_io_1.Server(exports.server, {
    cors: {
        origin: "*"
    }
});
exports.web.use((0, cors_1.default)({
    origin: "*"
}));
exports.web.use(express_1.default.json());
exports.web.use("/api", public_api_1.publicRouter);
exports.web.use("/api", api_1.apiRouter);
exports.web.use(error_middleware_1.errorMiddleware);
