import express from "express"
import { roleMiddleware } from "../middlewares/role.middleware"
import { AdminController } from "../controllers/admin.controller"

export const adminRouter = express.Router()
adminRouter.use(roleMiddleware("admin"))

adminRouter.get("/wa-login", AdminController.waLogin)
adminRouter.get("/wa-logged-in", AdminController.waLoggedIn)