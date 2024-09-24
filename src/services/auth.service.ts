import { compare } from "bcrypt";
import { prisma } from "../app/db";
import { ResponseError } from "../errors/response.error";
import { Validation } from "../validations/validation";
import { UserValidation } from "../validations/user.validation";
import { LoginUserRequest, SessionResponse, toSessionResponse } from "../models/auth.model";
import jwt from "jsonwebtoken"
import { toUserResponse, UserResponse } from "../models/user.model";
import { VerifyToken } from "./verify-token.service";

export class AuthService {
    static async login(req: LoginUserRequest): Promise<SessionResponse> {
        const loginReq = Validation.validate(UserValidation.LOGIN, req)
        const user = await prisma.user.findFirst({
            where: {
                OR: [{ username: loginReq.username }, { phone: loginReq.username }]
            }
        })

        if (user && await compare(loginReq.password, user.password)) {
            let isVerified = false
            if (user.phone === "admin") {
                isVerified = true
            } else {
                const verifyToken = await VerifyToken.getCodeByUserId(user.id)
                isVerified = verifyToken.is_verified
            }
            const userResponse = toUserResponse(user, isVerified)
            return AuthService.generateSession(userResponse)
        }

        throw new ResponseError(400, "wrong_credentials")
    }

    static updateVerified(user: UserResponse): SessionResponse {
        const verifiedUser = { ...user, isVerified: true }
        const token = jwt.sign(verifiedUser, process.env.JWT_SECRET!)
        return toSessionResponse(verifiedUser, token)
    }

    static generateSession(user: UserResponse): SessionResponse {
        const token = jwt.sign(user, process.env.JWT_SECRET!, { expiresIn: "1h" })
        return toSessionResponse(user, token)
    }
}