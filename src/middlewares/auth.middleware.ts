import { Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import { AuthRequest } from "../types/auth.request";
import { UserResponse } from "../models/user.model";
import { ResponseError } from "../errors/response.error";

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { authorization } = req.headers
    if (authorization && authorization.startsWith('Bearer ')) {
        const token = authorization.split(' ')[1]; // Mengambil token setelah 'Bearer '

        try {
            // Verifikasi token
            const jwtDecode = jwt.verify(token, process.env.JWT_SECRET!);
            req.user = jwtDecode as UserResponse;
            next();
            return;
        } catch (e) {
            next(e);
        }
    } else {
        next(new ResponseError(401, 'Unauthorized'));
    }
}