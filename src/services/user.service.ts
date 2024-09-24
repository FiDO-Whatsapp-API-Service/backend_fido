import { hash } from "bcrypt";
import { prisma } from "../app/db";
import { CreateUserRequest, SetRoleUserRequest, toUserResponse, toUserWithoutPassword, updateUserRequest, UserResponse, UserWithoutPassword } from "../models/user.model";
import { UserValidation } from "../validations/user.validation";
import { Validation } from "../validations/validation";
import { ResponseError } from "../errors/response.error";
import { VerifyToken } from "./verify-token.service";
import { NoticeService } from "./notice.service";
import { SystemService } from "../app/systemService";

export class UserService {
    static async getAll() {
        return await prisma.user.findMany()
    }
    static async create(request: CreateUserRequest): Promise<UserResponse> {
        const registerRequest = Validation.validate(UserValidation.REGISTER, request) as CreateUserRequest
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
        SystemService.sendMessage(user.phone, `Nomor anda telah terdaftar di sistem. lakukan verifikasi dengan memasukkan kode verifikasi anda berikut ini:\n*${verifyToken.code}*\n\n*Abaikan ini jika anda tidak merasa melakukan pendaftaran di sistem.*`)
        // Send Notification
        await NoticeService.create("Telah melakukan pendaftaran", user.id.toString())
        return toUserResponse(user, verifyToken.is_verified);
    }

    static async updateProfile(req: updateUserRequest, id: number): Promise<UserResponse> {
        const request = Validation.validate(UserValidation.UPDATE, req)
        try {
            const user = await prisma.user.update({
                where: { id },
                data: {
                    name: request.name,
                    email: request.email,
                    username: request.username,
                }
            })
            return toUserResponse(user, true)
        } catch (e: any) {
            throw new ResponseError(500, "Internal Server Error : " + e.message)
        }
    }

    static async updateRole(req: SetRoleUserRequest): Promise<UserWithoutPassword> {
        const request = Validation.validate(UserValidation.SET_ROLE, req)
        try {
            const user = await prisma.user.update({
                where: { id: request.id },
                data: { role: request.role }
            })
            return toUserWithoutPassword(user)
        } catch (e: any) {
            throw new ResponseError(500, "Internal Server Error : " + e.message)
        }
    }

    static async generateAdmin() {
        try {
            const isExist = await prisma.user.findFirst({ where: { phone: "admin" } }) !== null
            if (!isExist) {
                await prisma.user.create({
                    data: {
                        name: "Admin",
                        phone: "admin",
                        username: "admin",
                        password: await hash("admin", 10),
                        role: "admin"
                    }
                })
            }
        } catch (e) {
            console.log(e)
        }
    }
}