import { NextFunction, Request, Response } from "express";
import { ResponseError } from "../errors/response.error";
import { SystemService } from "../app/systemService";

export class AdminController {
    static waLogin(req: Request, res: Response, next: NextFunction) {
        try {
            SystemService.connect()
            return res.status(201).json({
                errors: null,
                message: "Waiting authentication"
            });
        } catch (e) {
            next(e)
        }
    }

    static waLoggedIn(req: Request, res: Response, next: NextFunction) {
        try {
            const session = SystemService.getSession()
            if (session?.user) {
                const data = session.user.id
                return res.status(200).json({
                    errors: null,
                    message: "Get Wa Logged In Successfully",
                    data
                });
            } else {
                throw new ResponseError(406, "Get Wa Logged In Failed")
            }
        } catch (e) {
            next(e)
        }
    }
}