import express from "express"
import { authMiddleware } from "../middlewares/auth.middleware"
import { AuthController } from "../controllers/auth.controller"
import { VerifyTokenController } from "../controllers/verify-token.controller"
import { deviceRouter } from "./device.route"
import { messageRouter } from "./message.route"
import { NoticeController } from "../controllers/notice.controller"
import { userRouter } from "./user.route"
import { adminRouter } from "./admin.route"

export const apiRouter = express.Router()
apiRouter.use(authMiddleware)
apiRouter.get("/session", AuthController.getSession)
apiRouter.post("/verify-otp", VerifyTokenController.verify)
apiRouter.get('/notice', NoticeController.index)

// User Router
apiRouter.use("/user", userRouter)
// Device Router
apiRouter.use('/device', deviceRouter)
// Message Router
apiRouter.use('/message', messageRouter)
// Admin Router
apiRouter.use("/admin", adminRouter)
