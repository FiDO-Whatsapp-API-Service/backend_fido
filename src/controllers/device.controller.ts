import { Response, NextFunction } from "express";
import { AuthRequest } from "../types/auth.request";
import { DeviceService } from "../services/device.service";
import { createSessionWhatsapp } from "../app/waService";
import { CreateDeviceRequest } from "../models/device.model";
import { DeviceTokenService } from "../services/device-token.service";
import { ResponseError } from "../errors/response.error";

export class DeviceController {
    static async getByUser(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const user = req.user!
            const response = await DeviceService.getByUser(user.id)
            return res.status(200).json({
                data: response
            })
        } catch (e) {
            next(e)
        }
    }
    static async create(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const user = req.user!
            const request = req.body as CreateDeviceRequest
            const newDevice = await DeviceService.create(request, user.id)
            createSessionWhatsapp(newDevice.id.toString(), newDevice.name, user.id)
            return res.status(201).json({
                data: newDevice
            })
        } catch (e) {
            next(e)
        }
    }

    static async login(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const { id } = req.params
            const device = await DeviceService.getById(parseInt(id))
            if (device) {
                createSessionWhatsapp(id.toString(), device.name, device.user_id)
                res.status(201).json({
                    errors: null,
                    message: "Waiting authentication"
                });
            } else {
                throw new ResponseError(404, "Device not found")
            }
        } catch (e) {
            next(e)
        }
    }

    static async refreshToken(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const { id } = req.params
            const response = await DeviceTokenService.updateToken(parseInt(id))
            return res.status(200).json({
                errors: null,
                message: "Refresh token successfully",
                data: response
            })
        } catch (e) {
            next(e)
        }
    }

    static async destroy(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const { id } = req.params
            await DeviceService.destroy(parseInt(id))
            return res.status(202).json({
                errors: null,
                message: "Device deleted successfully",
            })
        } catch (e) {
            next(e)
        }
    }


}