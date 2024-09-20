"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const socket_io_1 = require("socket.io");
const web_1 = require("./web");
exports.io = new socket_io_1.Server(web_1.server);
exports.io.on('connect', () => {
});
