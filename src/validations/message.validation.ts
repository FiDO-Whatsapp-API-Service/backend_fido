import { z, ZodType } from "zod";

export class MessageValidation {
    static readonly SEND: ZodType = z.object({
        message: z.string(),
        phone: z.string().min(1).max(20)
    })

    static readonly SEND_WITH_TOKEN: ZodType = z.object({
        token: z.string(),
        message: z.string(),
        phone: z.string().min(1).max(20)
    })
}