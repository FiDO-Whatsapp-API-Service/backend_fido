export type SendMessageRequest = {
    message: string
    phone: string
}

export interface TokenSendMessageRequest extends SendMessageRequest {
    token: string
}

