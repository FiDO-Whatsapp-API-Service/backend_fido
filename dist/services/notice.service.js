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
exports.NoticeService = void 0;
const db_1 = require("../app/db");
const logging_1 = require("../app/logging");
const response_error_1 = require("../errors/response.error");
class NoticeService {
    static getAll(take, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield db_1.prisma.noticeBoard.findMany({
                    where: {
                        OR: [
                            { receiver: user_id.toString() },
                            { receiver: "all" },
                        ],
                    },
                    orderBy: { created_at: 'desc' },
                    take
                });
            }
            catch (e) {
                throw new response_error_1.ResponseError(500, e.message);
            }
        });
    }
    static create(detail, receiver) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield db_1.prisma.noticeBoard.create({
                    data: {
                        detail,
                        receiver
                    }
                });
            }
            catch (e) {
                logging_1.logger.error(e.message);
            }
        });
    }
}
exports.NoticeService = NoticeService;
