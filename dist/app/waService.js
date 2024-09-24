"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.deleteSession = void 0;
exports.init = init;
exports.getSession = getSession;
exports.loadSessions = loadSessions;
exports.createSessionWhatsapp = createSessionWhatsapp;
exports.sendMessage = sendMessage;
const qrcode_1 = require("qrcode");
const pino_1 = __importDefault(require("pino"));
const baileys_1 = __importStar(require("@whiskeysockets/baileys"));
const fs_1 = require("fs");
const device_service_1 = require("../services/device.service");
const _1 = require("./");
const notice_service_1 = require("../services/notice.service");
const BASE_URL = process.env.BASE_URL;
let hasLoaded = false;
const sessions = new Map();
function folderSession(sessionId) {
    return `sessions/${sessionId}_auth`;
}
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        if (!hasLoaded) {
            hasLoaded = true;
            try {
                const devices = yield device_service_1.DeviceService.getAllConnected();
                if (devices.length === 0) {
                    console.log('No WhatsApp devices found. Exiting...');
                    for (const [key, value] of sessions.entries()) {
                        console.log(`id: ${key} =>`, (_b = (_a = value.user) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : "undefined");
                    }
                    return;
                }
                const promises = devices.map(device => loadSessions(device.id.toString(), device.name, device.user_id, device.user.phone));
                yield Promise.all(promises);
                console.log('All WhatsApp sessions loaded successfully.\nSessions');
                for (const [key, value] of sessions.entries()) {
                    console.log(`id: ${key} =>`, (_d = (_c = value.user) === null || _c === void 0 ? void 0 : _c.id) !== null && _d !== void 0 ? _d : "undefined");
                }
            }
            catch (error) {
                console.error('Error loading sessions:', error);
            }
        }
    });
}
function getSession(sessionId) {
    var _a;
    return (_a = sessions.get(sessionId)) !== null && _a !== void 0 ? _a : null;
}
function loadSessions(sessionId, deviceName, userId, userPhone) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const folder = folderSession(sessionId); // Path ke folder sesi
            const { state, saveCreds } = yield (0, baileys_1.useMultiFileAuthState)(folder);
            const logger = (0, pino_1.default)({ level: 'silent' });
            // const store = makeInMemoryStore({ logger });
            const sock = (0, baileys_1.default)({
                auth: state,
                printQRInTerminal: false,
                logger,
            });
            // store.bind(sock.ev);
            sock.ev.on('creds.update', saveCreds);
            yield new Promise((resolve, reject) => {
                sock.ev.on('connection.update', (update) => {
                    var _a, _b;
                    const { connection, lastDisconnect } = update;
                    if (connection === 'open') {
                        sessions.set(sessionId, Object.assign({}, sock));
                        resolve();
                    }
                    else if (connection === 'close') {
                        // Jika koneksi ditutup, mungkin karena error
                        const loggedOut = ((_b = (_a = lastDisconnect === null || lastDisconnect === void 0 ? void 0 : lastDisconnect.error) === null || _a === void 0 ? void 0 : _a.output) === null || _b === void 0 ? void 0 : _b.statusCode) === baileys_1.DisconnectReason.loggedOut;
                        if (loggedOut) {
                            reject(new Error('logout'));
                        }
                        else {
                            loadSessions(sessionId, deviceName, userId, userPhone);
                        }
                    }
                });
                // Tambahkan timeout jika ingin membatasi waktu menunggu koneksi "open"
                setTimeout(() => {
                    reject(new Error('timeout'));
                }, 10000);
            });
        }
        catch (error) {
            disconnectSession(sessionId, deviceName, userId, userPhone);
            console.error(`Failed to load session for ${sessionId}:`, error);
        }
    });
}
function createSessionWhatsapp(sessionId, deviceName, userId, userPhone) {
    return __awaiter(this, void 0, void 0, function* () {
        const folder = `sessions/${sessionId}_auth`;
        const { state, saveCreds } = yield (0, baileys_1.useMultiFileAuthState)(folder);
        const logger = (0, pino_1.default)({ level: 'warn' });
        // const store = makeInMemoryStore({ logger });
        const sock = (0, baileys_1.default)({
            auth: state,
            printQRInTerminal: false,
            logger,
        });
        // store.bind(sock.ev);
        sock.ev.on('creds.update', saveCreds);
        sock.ev.on('connection.update', (update) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            const { connection, lastDisconnect } = update;
            if (connection === 'close') {
                const shouldReconnect = ((_b = (_a = lastDisconnect === null || lastDisconnect === void 0 ? void 0 : lastDisconnect.error) === null || _a === void 0 ? void 0 : _a.output) === null || _b === void 0 ? void 0 : _b.statusCode) !== baileys_1.DisconnectReason.loggedOut;
                console.log('connection closed');
                // reconnect if not logged out
                if (shouldReconnect) {
                    createSessionWhatsapp(sessionId, deviceName, userId, userPhone);
                }
                else {
                    disconnectSession(sessionId, deviceName, userId, userPhone);
                }
            }
            else if (connection === 'open') {
                console.log('Sesions ID: ', sessionId, 'CONNECTED');
                sessions.set(sessionId, Object.assign({}, sock));
                _1.io.emit("auth_wa", { status: "connected", sessionId });
                device_service_1.DeviceService.updateConnectionStatus(parseInt(sessionId), true, (_d = (_c = sock.user) === null || _c === void 0 ? void 0 : _c.id) !== null && _d !== void 0 ? _d : "");
            }
            if (update.qr) {
                try {
                    const qr = yield (0, qrcode_1.toDataURL)(update.qr);
                    _1.io.emit("auth_wa", { qr, sessionId, status: "connecting" });
                }
                catch (_e) {
                    throw Error("Failed to create QR Code");
                }
            }
        }));
    });
}
function formatPhoneNumber(phone) {
    phone = phone.trim();
    if (phone.startsWith('0')) {
        return `62${phone.substring(1)}`;
    }
    else if (phone.startsWith('+62')) {
        return `62${phone.substring(1)}`;
    }
    else if (phone.startsWith('62')) {
        return phone;
    }
    else {
        return `62${phone}`;
    }
}
function sendMessage(session, phone, message) {
    return __awaiter(this, void 0, void 0, function* () {
        const jid = formatPhoneNumber(phone);
        yield session.sendMessage(jid + "@s.whatsapp.net", { text: message + `\n\n> send form ${BASE_URL}` });
    });
}
const deleteSession = (sessionId_1, ...args_1) => __awaiter(void 0, [sessionId_1, ...args_1], void 0, function* (sessionId, withLogout = true) {
    var _a;
    try {
        const folder = folderSession(sessionId);
        (0, fs_1.rmSync)(folder, { force: true, recursive: true });
        if (withLogout) {
            yield ((_a = getSession(sessionId)) === null || _a === void 0 ? void 0 : _a.logout());
        }
        sessions.delete(sessionId);
    }
    catch (err) {
        console.error("ERROR REASONS WHEN DELETE DEVICE: " + err);
    }
});
exports.deleteSession = deleteSession;
const disconnectSession = (sessionId, deviceName, user_id, userPhone) => {
    var _a;
    try {
        device_service_1.DeviceService.updateConnectionStatus(parseInt(sessionId), false);
        notice_service_1.NoticeService.create(`Device "${deviceName}" Disconnected`, user_id.toString());
        (0, exports.deleteSession)(sessionId, false);
    }
    catch (e) {
        console.error("ERROR REASONS WHEN DISCONNECT DEVICE: " + ((_a = e.message) !== null && _a !== void 0 ? _a : "No Message"));
    }
};
