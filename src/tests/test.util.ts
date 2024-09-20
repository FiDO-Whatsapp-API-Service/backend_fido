import { hash } from "bcrypt";
import { prisma } from "../app/db";

export class UserTest {
    static async delete(phone: string) {
        await prisma.user.deleteMany({
            where: {
                phone
            }
        })
    }

    static async create(phone: string, name: string, password: string) {
        await prisma.user.create({
            data: {
                phone,
                name,
                password: await hash(password, 10),
                username: phone
            }
        })
    }
}