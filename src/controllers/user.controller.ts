import { NextFunction, Request, Response } from "express";
import { CreateUserRequest, SetRoleUserRequest, updateUserRequest } from "../models/user.model";
import { UserService } from "../services/user.service";
import { AuthRequest } from "../types/auth.request";
import { AuthService } from "../services/auth.service";
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

    static async updateUser(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const user = req.user!
            const request = req.body as updateUserRequest
            const updateUser = await UserService.updateProfile(request, user.id)
            const response = AuthService.generateSession(updateUser)

            res.status(201).json({
                errors: null,
                message: "Update user successfully",
                data: response,
            })
        } catch (e) {
            next(e)
        }
    }

    static async setRole(req: Request, res: Response, next: NextFunction) {
        try {
            const request = req.body as SetRoleUserRequest
            const response = await UserService.updateRole(request)
            res.status(201).send({
                errors: null,
                message: "Update role successfully",
                data: response
            })
        } catch (e) {
            next(e)
        }
    }
}