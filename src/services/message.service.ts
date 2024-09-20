import { getSession, sendMessage } from "../app/waService"
import { ResponseError } from "../errors/response.error"
import { SendMessageRequest } from "../models/message.model"
import { MessageValidation } from "../validations/message.validation"
import { Validation } from "../validations/validation"

export class MessageService {
    static async send(req: SendMessageRequest, sessionId: string) {
        const reqValidated = Validation.validate(MessageValidation.SEND, req)
        try {
            const session = getSession(sessionId)
            return await sendMessage(session, reqValidated.phone, reqValidated.message)
        } catch (e) {
            throw new ResponseError(400, "Session Id tidak ditemukan")
        }
    }
}