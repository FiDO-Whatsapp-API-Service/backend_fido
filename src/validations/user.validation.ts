import { z, ZodType } from "zod";

export class UserValidation {
    static readonly REGISTER: ZodType = z.object({
        phone: z.string().min(1).max(20),
        name: z.string().min(1).max(100),
        password: z.string().min(1).max(100)
    })

    static readonly LOGIN: ZodType = z.object({
        username: z.string().min(1).max(20),
        password: z.string().min(1).max(100)
    })

    static readonly VERIFY_CODE: ZodType = z.object({
        otp: z.number(),
    })

    static readonly UPDATE: ZodType = z.object({
        username: z.string().min(1).max(20),
        name: z.string().min(1).max(100),
        email: z.string().email().nullable().optional()
    })

    static readonly SET_ROLE: ZodType = z.object({
        id: z.number(),
        role: z.enum(['admin', 'user'])
    })

}