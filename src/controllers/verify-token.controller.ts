import { NextFunction, Response } from "express";
import { VerifyTokenRequest } from "../models/verify-token.model";
import { AuthRequest } from "../types/auth.request";
import { VerifyToken } from "../services/verify-token.service";
import { AuthService } from "../services/auth.service";

export class VerifyTokenController {
    static async verify(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const user = req.user!
            const request = req.body as VerifyTokenRequest
            await VerifyToken.updateStatus(request, user.id)

            const response = AuthService.updateVerified(user)
            res.status(201).send({
                errors: null,
                message: "Verify token successfully",
                data: response
            })
        } catch (e) {
            next(e)
        }
    }
}