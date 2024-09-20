import { prisma } from "../app/db";
import { logger } from "../app/logging";
import { ResponseError } from "../errors/response.error";

export class NoticeService {
    static async getAll(take: number, user_id: number) {
        try {
            return await prisma.noticeBoard.findMany({
                where: {
                    OR: [
                        { receiver: user_id.toString() },
                        { receiver: "all" },
                    ],
                },
                orderBy: { created_at: 'desc' },
                take
            })
        } catch (e: any) {
            throw new ResponseError(500, e.message)
        }
    }

    static async create(detail: string, receiver: string) {
        try {
            await prisma.noticeBoard.create({
                data: {
                    detail,
                    receiver
                }
            })
        } catch (e: any) {
            logger.error(e.message)
        }
    }
}