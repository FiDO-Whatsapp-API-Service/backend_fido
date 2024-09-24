import { NextFunction, Request, Response } from "express";
import { AuthRequest } from "../types/auth.request";
import { SendMessageRequest, TokenSendMessageRequest } from "../models/message.model";
import { MessageService } from "../services/message.service";
import { Validation } from "../validations/validation";
import { MessageValidation } from "../validations/message.validation";

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

    static async sendMessageWithToken(req: Request, res: Response, next: NextFunction) {
        try {
            const request = Validation.validate(MessageValidation.SEND_WITH_TOKEN, req.body) as TokenSendMessageRequest
            const response = await MessageService.sendWithToken(request)
            res.status(201).json({
                errors: null,
                message: `Send Message to ${request.phone} Succesfully`,
                send: request.message,
                data: response
            })
        } catch (e) {
            next(e)
        }
    }
}