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
exports.NoticeController = void 0;
const notice_service_1 = require("../services/notice.service");
class NoticeController {
    static index(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { length = 5 } = req.query;
                const user = req.user;
                const response = yield notice_service_1.NoticeService.getAll(length, user.id);
                res.status(200).send({
                    errors: null,
                    message: "Get all notice successfully",
                    data: response
                });
            }
            catch (e) {
                next(e);
            }
        });
    }
}
exports.NoticeController = NoticeController;
