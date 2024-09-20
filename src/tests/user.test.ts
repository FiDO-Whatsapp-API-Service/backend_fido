import supertest from "supertest";
import { web } from "../app";
import { logger } from "../app/logging";
import { UserTest } from "./test.util";

describe('POST /api/users', () => {
    const PHONE = '08123456789'
    const NAME = 'test'
    afterEach(async () => {
        await UserTest.delete(PHONE)
    })
    it('should reject request new user if request is invalid', async () => {
        const response = await supertest(web).post('/api/users')
            .send({
                phone: '',
                name: '',
                password: ''
            })
        logger.debug(response.body)
        expect(response.status).toBe(400)
        expect(response.body.errors).toBeDefined()
    })

    it('should register new user', async () => {
        const response = await supertest(web)
            .post('/api/users')
            .send({
                phone: PHONE,
                name: NAME,
                password: 'secret'
            })

        logger.debug(response.body)
        expect(response.status).toBe(201)
        expect(response.body.data.username).toBe(PHONE)
        expect(response.body.data.name).toBe(NAME)
        expect(response.body.data.role).toBe("user")

    })
})