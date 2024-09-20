import { NextFunction, Request, Response } from "express";
import { CreateUserRequest } from "../models/user.model";
import { UserService } from "../services/user.service";

export class UserController {

    static async register(req: Request, res: Response, next: NextFunction) {
        try {
            const request: CreateUserRequest = req.body as CreateUserRequest;
            const response = await UserService.create(request);
            res.status(201).json({
                data: response,
                errors: null,
                message: "Create user successfully"
            })
        } catch (e) {
            next(e)
        }
    }

    static async getUsers(req: Request, res: Response, next: NextFunction) {
        try {
            const response = await UserService.getAll();
            res.status(200).json({
                data: response,
                errors: null,
                message: "Get all data user successfully"
            })
        } catch (e) {
            next(e)
        }
    }
}