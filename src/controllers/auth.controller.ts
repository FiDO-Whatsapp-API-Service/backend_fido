import { NextFunction, Request, Response } from "express";
import { LoginUserRequest } from "../models/auth.model";
import { AuthService } from "../services/auth.service";
import { AuthRequest } from "../types/auth.request";

export class AuthController {
    static async login(req: Request, res: Response, next: NextFunction) {
        try {
            const request = req.body as LoginUserRequest
            const response = await AuthService.login(request)
            res.status(200).send({
                errors: null,
                message: "Login user successfully",
                data: response,
            })
        } catch (e) {
            next(e)
        }
    }

    static async getSession(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const user = req.user
            res.status(200).send({
                errors: null,
                message: "Get session user successfully",
                data: user
            })
        } catch (e) {
            next(e)
        }
    }
}