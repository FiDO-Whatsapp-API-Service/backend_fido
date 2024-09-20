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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../app");
const logging_1 = require("../app/logging");
const test_util_1 = require("./test.util");
describe('POST /api/users', () => {
    const PHONE = '08123456789';
    const NAME = 'test';
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield test_util_1.UserTest.delete(PHONE);
    }));
    it('should reject request new user if request is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.web).post('/api/users')
            .send({
            phone: '',
            name: '',
            password: ''
        });
        logging_1.logger.debug(response.body);
        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
    }));
    it('should register new user', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.web)
            .post('/api/users')
            .send({
            phone: PHONE,
            name: NAME,
            password: 'secret'
        });
        logging_1.logger.debug(response.body);
        expect(response.status).toBe(201);
        expect(response.body.data.username).toBe(PHONE);
        expect(response.body.data.name).toBe(NAME);
        expect(response.body.data.role).toBe("user");
    }));
});
