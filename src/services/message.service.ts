import { getSession, sendMessage } from "../app/waService"
import { ResponseError } from "../errors/response.error"
import { SendMessageRequest, TokenSendMessageRequest } from "../models/message.model"
import { MessageValidation } from "../validations/message.validation"
import { Validation } from "../validations/validation"
import { DeviceTokenService } from "./device-token.service"

export class MessageService {
    static async send(req: SendMessageRequest, sessionId: string) {
        const reqValidated = Validation.validate(MessageValidation.SEND, req)
        try {
            const session = getSession(sessionId)
            return await sendMessage(session!, reqValidated.phone, reqValidated.message)
        } catch (e) {
            throw new ResponseError(400, "Session Id tidak ditemukan")
        }
    }

    static async sendWithToken(req: TokenSendMessageRequest) {
        const { token, phone, message } = req
        const getDeviceid = await DeviceTokenService.getDeviceIdByToken(token)
        if (!getDeviceid) throw new ResponseError(401, "Token Invalid")
        try {
            const session = getSession(getDeviceid.toString())
            return await sendMessage(session!, phone, message)
        } catch (e: any) {
            throw new ResponseError(400, "Session Id tidak ditemukan")
        }
    }
}