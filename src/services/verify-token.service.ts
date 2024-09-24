import { VerifiedCode } from "@prisma/client"
import { prisma } from "../app/db"
import { ResponseError } from "../errors/response.error"
import { Validation } from "../validations/validation"
import { UserValidation } from "../validations/user.validation"
import { VerifyTokenRequest } from "../models/verify-token.model"

export class VerifyToken {
    static async create(user_id: number, code: number): Promise<VerifiedCode> {
        try {
            return await prisma.verifiedCode.create({ data: { user_id, code } })
        } catch (e: any) {
            throw new Error("Failed to create verified code: " + e.message)
        }
    }

    static async getCodeByUserId(user_id: number) {
        try {
            const otp = await prisma.verifiedCode.findFirst({ where: { user_id } })
            if (!otp) {
                return await prisma.verifiedCode.create({ data: { user_id, code: Math.floor(1000 + Math.random() * 9000) } })
            }
            return otp
        } catch (e: any) {
            throw new Error("Failed to get code: " + e.message)
        }
    }

    static async updateStatus(req: VerifyTokenRequest, user_id: number): Promise<VerifiedCode> {
        const verifyReq = Validation.validate(UserValidation.VERIFY_CODE, req)
        try {
            await prisma.verifiedCode.findFirst({ where: { user_id, code: verifyReq.otp } })
            return await prisma.verifiedCode.update({ where: { user_id, code: verifyReq.otp }, data: { is_verified: true } })
        } catch (e: any) {
            throw new ResponseError(400, "wrong_otp")
        }
    }

}