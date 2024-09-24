import { prisma } from "../app/db";
import { DeviceTokenService } from "./device-token.service";
import { deleteSession } from "../app/waService";
import { Device } from "@prisma/client";
import { Validation } from "../validations/validation";
import { DeviceValidation } from "../validations/device.validation";
import { CreateDeviceRequest, DeviceWithUser } from "../models/device.model";

export class DeviceService {
    static async getAll(): Promise<Device[]> {
        return await prisma.device.findMany()
    }
    static async getAllConnected(): Promise<DeviceWithUser[]> {
        return await prisma.device.findMany({ where: { is_connected: true }, include: { user: true } })
    }

    static async create(req: CreateDeviceRequest, user_id: number): Promise<Device> {
        const registerRequest = Validation.validate(DeviceValidation.CREATE, req) as CreateDeviceRequest
        try {
            const device = await prisma.device.create({
                data: { name: registerRequest.name, user_id }
            })
            // GENERATE TOKEN
            await DeviceTokenService.createToken(device.id)
            return device
        } catch (e: any) {
            throw new Error("Failed to create device: " + e.message)
        }
    }

    static async getById(id: number): Promise<Device | null> {
        return await prisma.device.findUnique({ where: { id } })
    }

    static async checkIdIsExists(id: number): Promise<boolean> {
        return (await prisma.device.findUnique({ where: { id } }) !== null)
    }

    static async getByUser(user_id: number): Promise<Device[]> {
        try {
            const devices = await prisma.device.findMany({ where: { user_id }, include: { device_token: true } })
            return devices
        } catch (e: any) {
            throw new Error("Failed to get devices: " + e.message)
        }
    }

    static async destroy(id: number) {
        try {
            const device = await prisma.device.delete({ where: { id } })
            deleteSession(id.toString(), device.is_connected)
        } catch (e: any) {
            throw new Error("Failed to delete device: " + e.message)
        }
    }

    static async updateConnectionStatus(id: number, is_connected: boolean, phone?: string): Promise<void> {
        try {
            if (phone) {
                await prisma.device.updateMany({ where: { id }, data: { is_connected, phone } })
            } else[
                await prisma.device.updateMany({ where: { id }, data: { is_connected } })
            ]
        } catch (e: any) {
            throw new Error("Failed to set device disconnected: " + e.message)
        }
    }
}