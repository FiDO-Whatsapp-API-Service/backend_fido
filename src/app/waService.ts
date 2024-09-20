import { toDataURL } from "qrcode"
import pino from "pino"
import makeWASocket, { useMultiFileAuthState as multiFileAuthState, DisconnectReason, makeInMemoryStore } from "@whiskeysockets/baileys"
import { Boom } from "@hapi/boom";
import { rmSync } from "fs";
import { DeviceService } from "../services/device.service"
import { io } from "./"
import { NoticeService } from "../services/notice.service";
const BASE_URL = process.env.BASE_URL
let hasLoaded = false
const sessions = new Map();

function folderSession(sessionId: string) {
    return `sessions/${sessionId}_auth`
}

export async function init() {
    if (!hasLoaded) {
        hasLoaded = true
        try {
            const devices = await DeviceService.getAllConnected();
            // loadSessions("admin")
            const promises = devices.map(device => loadSessions(device.id.toString(), device.name, device.user_id));
            await Promise.all(promises);
            console.log('All WhatsApp sessions loaded successfully.\nSessions');
            for (const [key, value] of sessions.entries()) {
                console.log(`id: ${key} =>`, value.user?.id ?? "undefined");
            }
        } catch (error) {
            console.error('Error loading sessions:', error);
        }
    }
}

export function logSessions() {
    console.log("Sessions: ", sessions.keys());
    return { hasLoaded, sessions: sessions.keys() };
}
export function getSession(sessionId: string) {
    return sessions.get(sessionId) ?? null;
}
export async function loadSessions(sessionId: string, deviceName: string, user_id: number) {
    try {
        const folder = folderSession(sessionId); // Path ke folder sesi
        const { state, saveCreds } = await multiFileAuthState(folder);
        const logger = pino({ level: 'silent' }) as any;
        const store = makeInMemoryStore({ logger });
        const sock = makeWASocket({
            auth: state,
            printQRInTerminal: false,
            logger,
        });
        store.bind(sock.ev);

        sock.ev.on('creds.update', saveCreds);

        await new Promise<void>((resolve, reject) => {
            sock.ev.on('connection.update', (update) => {
                const { connection, lastDisconnect } = update;

                if (connection === 'open') {
                    sessions.set(sessionId, { ...sock, store });
                    resolve();
                } else if (connection === 'close') {
                    // Jika koneksi ditutup, mungkin karena error
                    const loggedOut = (lastDisconnect?.error as Boom)?.output?.statusCode === DisconnectReason.loggedOut
                    if (loggedOut) {
                        disconnectSession(sessionId, deviceName, user_id)
                        reject(new Error('logout'));
                    }
                }
            });
            // Tambahkan timeout jika ingin membatasi waktu menunggu koneksi "open"
            setTimeout(() => {
                reject(new Error('timeout'));
            }, 10000);
        });
    } catch (error: any) {
        disconnectSession(sessionId, deviceName, user_id)
        console.error(`Failed to load session for ${sessionId}:`, error);
    }
}

export async function createSessionWhatsapp(sessionId: string, deviceName: string, user_id: number) {
    const folder = `sessions/${sessionId}_auth`
    const { state, saveCreds } = await multiFileAuthState(folder);
    const logger = pino({ level: 'warn' }) as any;
    const store = makeInMemoryStore({ logger });
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: false,
        logger,
    });
    store.bind(sock.ev);

    sock.ev.on('creds.update', saveCreds)
    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update

        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut
            console.log('connection closed')
            // reconnect if not logged out
            if (shouldReconnect) {
                createSessionWhatsapp(sessionId, deviceName, user_id)
            } else {
                disconnectSession(sessionId, deviceName, user_id)
            }
        } else if (connection === 'open') {
            console.log('Sesions ID: ', sessionId, 'CONNECTED')
            sessions.set(sessionId, sock)
            io.emit("auth_wa", { status: "connected", sessionId })
            if (sessionId !== "admin") {
                DeviceService.updateConnectionStatus(parseInt(sessionId), true, sock.user?.id ?? "")
            }
        }

        if (update.qr) {
            try {
                const qr = await toDataURL(update.qr);
                io.emit("auth_wa", { qr, sessionId, status: "connecting" })
            } catch {
                throw Error("Failed to create QR Code");
            }
        }
    })
}

function formatPhoneNumber(phone: string): string {
    phone = phone.trim();
    if (phone.startsWith('0')) {
        return `62${phone.substring(1)}`;
    } else if (phone.startsWith('+62')) {
        return `62${phone.substring(1)}`;
    } else if (phone.startsWith('62')) {
        return phone;
    } else {
        return `62${phone}`;
    }
}

export async function sendMessage(session: any, phone: string, message: string) {
    const jid = formatPhoneNumber(phone)
    await session.sendMessage(jid + "@s.whatsapp.net", { text: message + `\n\n> send form ${BASE_URL}` })
}

export const deleteSession = async (sessionId: string, withLogout = true) => {
    try {
        const folder = folderSession(sessionId);
        rmSync(folder, { force: true, recursive: true });
        if (withLogout) {
            await getSession(sessionId)?.logout()
        }
        sessions.delete(sessionId);
    } catch (err) {
        console.error("ERROR REASONS WHEN DELETE DEVICE: " + err)
    }
};

const disconnectSession = (sessionId: string, deviceName: string, user_id: number) => {
    DeviceService.updateConnectionStatus(parseInt(sessionId), false)
    NoticeService.create(`Device "${deviceName}" Disconnected`, user_id.toString())
    deleteSession(sessionId, false)
}
