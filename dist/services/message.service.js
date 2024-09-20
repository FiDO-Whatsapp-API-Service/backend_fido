"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageService = void 0;
const waService_1 = require("../app/waService");
const response_error_1 = require("../errors/response.error");
const message_validation_1 = require("../validations/message.validation");
const validation_1 = require("../validations/validation");
class MessageService {
    static send(req, sessionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const reqValidated = validation_1.Validation.validate(message_validation_1.MessageValidation.SEND, req);
            try {
                const session = (0, waService_1.getSession)(sessionId);
                return yield (0, waService_1.sendMessage)(session, reqValidated.phone, reqValidated.message);
            }
            catch (e) {
                throw new response_error_1.ResponseError(400, "Session Id tidak ditemukan");
            }
        });
    }
}
exports.MessageService = MessageService;
