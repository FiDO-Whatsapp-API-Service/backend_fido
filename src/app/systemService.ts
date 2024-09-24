import makeWASocket, { DisconnectReason, useMultiFileAuthState, WASocket } from "@whiskeysockets/baileys";
import { io } from ".";
import pino from "pino";
import { Boom } from "@hapi/boom";
import { toDataURL } from "qrcode";

export class SystemService {
    private static isLoggedIn = false;
    private static session?: WASocket

    static getSession() {
        return SystemService.session
    }

    private static async loadSession() {
        const { state, saveCreds } = await useMultiFileAuthState("system_session_auth");
        const logger = pino({ level: 'warn' }) as any;
        const sock = makeWASocket({
            auth: state,
            printQRInTerminal: false,
            logger,
        });

        sock.ev.on('creds.update', saveCreds)
        sock.ev.on('connection.update', async (update) => {
            const { connection, lastDisconnect } = update
            if (connection === 'close') {
                const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut
                console.log('connection closed')
                // reconnect if not logged out
                if (shouldReconnect) {
                    SystemService.loadSession()
                } else {
                    SystemService.isLoggedIn = false
                }
            } else if (connection === 'open') {
                SystemService.session = sock
                console.log('=== ADMIN CONNECTED === ')
                io.emit("admin_auth_wa", { status: "connected" })
                SystemService.isLoggedIn = true
            }

            if (update.qr) {
                try {
                    const qr = await toDataURL(update.qr);
                    io.emit("admin_auth_wa", { qr, status: "connecting" })
                } catch {
                    throw Error("Failed to create QR Code");
                }
            }
        })
    }

    static async connect() {
        if (!SystemService.isLoggedIn) {
            SystemService.loadSession()
        }
    }

    private static formatPhoneNumber(phone: string): string {
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

    static async sendMessage(phone: string, message: string) {
        const jid = SystemService.formatPhoneNumber(phone)
        try {
            await SystemService.session!.sendMessage(jid + "@s.whatsapp.net", { text: message + `\n\n> send form ${process.env.BASE_URL}` })
        } catch (e) {
            console.log("Session System is Null")
        }
    }
}