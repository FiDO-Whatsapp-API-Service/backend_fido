import { z, ZodType } from "zod";

export class MessageValidation {
    static readonly SEND: ZodType = z.object({
        message: z.string(),
        phone: z.string().min(1).max(20)
    })
}