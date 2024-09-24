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
exports.MessageController = void 0;
const message_service_1 = require("../services/message.service");
const validation_1 = require("../validations/validation");
const message_validation_1 = require("../validations/message.validation");
class MessageController {
    static sendMessage(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const request = req.body;
                const response = yield message_service_1.MessageService.send(request, id.toString());
                res.status(201).json({
                    errors: null,
                    message: "Send Message Succesfully",
                    data: response
                });
            }
            catch (e) {
                next(e);
            }
        });
    }
    static sendMessageWithToken(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const request = validation_1.Validation.validate(message_validation_1.MessageValidation.SEND_WITH_TOKEN, req.body);
                const response = yield message_service_1.MessageService.sendWithToken(request);
                res.status(201).json({
                    errors: null,
                    message: `Send Message to ${request.phone} Succesfully`,
                    send: request.message,
                    data: response
                });
            }
            catch (e) {
                next(e);
            }
        });
    }
}
exports.MessageController = MessageController;
