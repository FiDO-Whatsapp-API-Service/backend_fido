import { hash } from "bcrypt";
import { prisma } from "../app/db";
import { CreateUserRequest, toUserResponse, UserResponse } from "../models/user.model";
import { UserValidation } from "../validations/user.validation";
import { Validation } from "../validations/validation";
import { ResponseError } from "../errors/response.error";
import { VerifyToken } from "./verify-token.service";
import { NoticeService } from "./notice.service";

export class UserService {
    static async getAll() {
        return await prisma.user.findMany()
    }
    static async create(request: CreateUserRequest): Promise<UserResponse> {
        const registerRequest = Validation.validate(UserValidation.REGISTER, request)
        const uniquePhone = await prisma.user.findUnique({ where: { phone: registerRequest.phone } })

        if (uniquePhone) {
            throw new ResponseError(400, "phone_exists")
        }

        const password = await hash(registerRequest.password, 10)
        const user = await prisma.user.create({
            data: { ...registerRequest, username: registerRequest.phone, password }
        })
        // Get Verified status
        const verifyToken = await VerifyToken.getCodeByUserId(user.id)
        // Send Notification
        await NoticeService.create("Telah melakukan pendaftaran", user.id.toString())
        return toUserResponse(user, verifyToken.is_verified);
    }
}