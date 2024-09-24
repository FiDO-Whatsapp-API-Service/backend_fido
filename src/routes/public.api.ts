import express from "express"
import { UserController } from "../controllers/user.controller"
import { AuthController } from "../controllers/auth.controller"
import { MessageController } from "../controllers/message.controller"

export const publicRouter = express.Router()
publicRouter.post("/users", UserController.register)
publicRouter.post("/login", AuthController.login)

// Send Message With Token
publicRouter.post("/public/message/send", MessageController.sendMessageWithToken)