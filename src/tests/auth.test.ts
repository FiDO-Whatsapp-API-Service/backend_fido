import supertest from "supertest"
import { web } from "../app"
import { logger } from "../app/logging"
import { UserTest } from "./test.util"

describe('POST /api/login', () => {
    const PHONE = '08123456789'
    const NAME = 'test'
    const PASS = 'secret'

    beforeEach(async () => {
        await UserTest.create(PHONE, NAME, PASS)
    })
    afterEach(async () => {
        await UserTest.delete(PHONE)
    })
    it('should reject request if credentials are null', async () => {
        const response = await supertest(web).post('/api/login')
            .send({
                phone: '',
                password: ''
            })
        logger.debug(response.body)
        expect(response.status).toBe(400)
        expect(response.body.errors).toBeDefined()
    })

    it('should login user', async () => {
        const response = await supertest(web)
            .post('/api/login')
            .send({
                phone: PHONE,
                password: PASS
            })

        logger.debug(response.body)
        expect(response.status).toBe(200)
        expect(response.body.data.phone).toBe(PHONE)
        expect(response.body.data.token).toBeDefined()
    })
})