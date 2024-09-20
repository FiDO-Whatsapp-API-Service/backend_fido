import { compare } from "bcrypt";
import { prisma } from "../app/db";
import { ResponseError } from "../errors/response.error";
import { Validation } from "../validations/validation";
import { UserValidation } from "../validations/user.validation";
import { LoginUserRequest, LoginUserResponse, toLoginResponse } from "../models/auth.model";
import jwt from "jsonwebtoken"
import { toUserResponse, UserResponse } from "../models/user.model";
import { VerifyToken } from "./verify-token.service";

export class AuthService {
    static async login(req: LoginUserRequest): Promise<LoginUserResponse> {
        const loginReq = Validation.validate(UserValidation.LOGIN, req)
        const user = await prisma.user.findUnique({ where: { phone: loginReq.phone } })

        if (user && await compare(loginReq.password, user.password)) {
            const verifyToken = await VerifyToken.getCodeByUserId(user.id)
            const userResponse = toUserResponse(user, verifyToken.is_verified)
            const token = jwt.sign({ ...userResponse, isVerified: verifyToken.is_verified }, process.env.JWT_SECRET!)
            return toLoginResponse(userResponse, token)
        }
        throw new ResponseError(400, "wrong_credentials")
    }

    static updateVerified(user: UserResponse): LoginUserResponse {
        const verifiedUser = { ...user, isVerified: true }
        const token = jwt.sign(verifiedUser, process.env.JWT_SECRET!)
        return toLoginResponse(verifiedUser, token)
    }
}