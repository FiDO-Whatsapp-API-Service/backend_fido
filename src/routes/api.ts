import express from "express"
import { UserController } from "../controllers/user.controller"
import { authMiddleware } from "../middlewares/auth.middleware"
import { AuthController } from "../controllers/auth.controller"
import { VerifyTokenController } from "../controllers/verify-token.controller"
import { deviceRouter } from "./device.route"
import { messageRouter } from "./message.route"
import { NoticeController } from "../controllers/notice.controller"

export const apiRouter = express.Router()
apiRouter.use(authMiddleware)
apiRouter.get("/session", AuthController.getSession)
apiRouter.get("/users", UserController.getUsers)
apiRouter.post("/verify-otp", VerifyTokenController.verify)
apiRouter.get('/notice', NoticeController.index)

// Device Router
apiRouter.use('/device', deviceRouter)
// Message Router
apiRouter.use('/message', messageRouter)
