import { NextFunction, Response } from "express";
import { AuthRequest } from "../types/auth.request";
import { SendMessageRequest } from "../models/message.model";
import { MessageService } from "../services/message.service";

export class MessageController {
    static async sendMessage(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const { id } = req.params
            const request = req.body as SendMessageRequest
            const response = await MessageService.send(request, id.toString())
            res.status(201).json({
                errors: null,
                message: "Send Message Succesfully",
                data: response
            });
        } catch (e) {
            next(e)
        }
    }
}