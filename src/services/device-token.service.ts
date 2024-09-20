import { prisma } from "../app/db";
import { DeviceToken } from "@prisma/client";
import crypto from "crypto"
import { NoticeService } from "./notice.service";
import { DeviceService } from "./device.service";

export class DeviceTokenService {
    static async getSessionId(token: string): Promise<number | null> {
        return (await prisma.deviceToken.findUnique({ where: { token } }))?.device_id ?? null
    }

    static async createToken(device_id: number): Promise<DeviceToken> {
        const token = crypto.randomBytes(32).toString('hex')
        const newDeviceToken = await prisma.deviceToken.create({ data: { token, device_id } })
        return newDeviceToken
    }
    static async updateToken(device_id: number): Promise<DeviceToken | null> {
        try {
            const token = crypto.randomBytes(32).toString('hex')
            const result = await prisma.deviceToken.update({ where: { device_id }, data: { token } })
            const device = await DeviceService.getById(device_id)
            if (device) {
                await NoticeService.create(`Telah melakukan refresh token pada device "${device.name}"`, device.user_id.toString())
            }
            return result
        } catch (e: any) {
            throw new Error("Failed Refresh Token" + e.message)
        }
    }
}