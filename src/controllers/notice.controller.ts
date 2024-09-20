import { NextFunction, Response } from "express";
import { AuthRequest } from "../types/auth.request";
import { NoticeService } from "../services/notice.service";

export class NoticeController {
    static async index(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const { length = 5 } = req.query
            const user = req.user!
            const response = await NoticeService.getAll(length as number, user.id)
            res.status(200).send({
                errors: null,
                message: "Get all notice successfully",
                data: response
            })
        } catch (e) {
            next(e)
        }
    }
}