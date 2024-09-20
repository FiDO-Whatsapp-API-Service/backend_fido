import { User } from "@prisma/client";
import { Request } from "express";
import { UserResponse } from "../models/user.model";

export interface AuthRequest extends Request {
    user?: UserResponse
}