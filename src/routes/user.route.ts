import express from 'express'
import { UserController } from '../controllers/user.controller'
import { roleMiddleware } from '../middlewares/role.middleware'

export const userRouter = express.Router()
userRouter.get("/", roleMiddleware("admin"), UserController.getUsers)
userRouter.put("/", UserController.updateUser)
userRouter.post("/:id/role", roleMiddleware("admin"), UserController.setRole)