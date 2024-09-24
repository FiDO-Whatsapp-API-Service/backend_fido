import { NextFunction, Response } from "express";
import { AuthRequest } from "../types/auth.request";

export const roleMiddleware = (...allowedRoles: string[]) => {
    return async (req: AuthRequest, res: Response, next: NextFunction) => {
        const { role } = req.user!;
        if (allowedRoles.includes(role)) {
            return next();
        }
        res.status(403).json({
            errors: 'Forbidden',
            message: `Access is restricted to roles: ${allowedRoles.join(', ')}`,
        });
    };
};