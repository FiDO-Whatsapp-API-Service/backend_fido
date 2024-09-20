import { Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import { AuthRequest } from "../types/auth.request";
import { UserResponse } from "../models/user.model";

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { authorization } = req.headers
    if (authorization && authorization.split(" ")[1]) {
        const jwtDecode = jwt.verify(authorization.split(" ")[1], process.env.JWT_SECRET!);
        req.user = jwtDecode as UserResponse;
        next()
        return
    }
    res.status(401).json({
        errors: "Unauthorized",
        message: "need authorization"
    })
}